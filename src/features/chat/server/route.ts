import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { getMember } from "@/features/members/utils";
import { 
  DATABASE_ID, 
  CHAT_ROOMS_ID, 
  CHAT_MESSAGES_ID 
} from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createChatRoomSchema, sendMessageSchema } from "../schemas";

const app = new Hono()
  // Get or create chat room for a project
  .get(
    "/room/:projectId",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const { projectId } = c.req.param();

      // Check if user is member of the workspace
      const roomQuery = await databases.listDocuments(
        DATABASE_ID,
        CHAT_ROOMS_ID,
        [Query.equal("projectId", projectId)]
      );

      if (roomQuery.documents.length > 0) {
        return c.json({ data: roomQuery.documents[0] });
      }

      // Room doesn't exist, create it (this happens automatically when project is accessed)
      return c.json({ data: null });
    }
  )
  // Create a chat room for a project
  .post(
    "/room",
    sessionMiddleware,
    zValidator("json", createChatRoomSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { projectId, workspaceId, name, description } = c.req.valid("json");

      // Verify user is a member of the workspace
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Check if room already exists
      const existingRoom = await databases.listDocuments(
        DATABASE_ID,
        CHAT_ROOMS_ID,
        [Query.equal("projectId", projectId)]
      );

      if (existingRoom.documents.length > 0) {
        return c.json({ data: existingRoom.documents[0] });
      }

      // Create new room
      const room = await databases.createDocument(
        DATABASE_ID,
        CHAT_ROOMS_ID,
        ID.unique(),
        {
          projectId,
          workspaceId,
          name,
          description,
          createdAt: new Date().toISOString(),
        }
      );

      return c.json({ data: room });
    }
  )
  // Send a message to a project's chat room
  .post(
    "/message",
    sessionMiddleware,
    zValidator("json", sendMessageSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { content, projectId } = c.req.valid("json");

      // Get the chat room
      const roomQuery = await databases.listDocuments(
        DATABASE_ID,
        CHAT_ROOMS_ID,
        [Query.equal("projectId", projectId)]
      );

      if (roomQuery.documents.length === 0) {
        return c.json({ error: "Chat room not found" }, 404);
      }

      const room = roomQuery.documents[0];

      // Verify user is a member of the workspace
      const member = await getMember({
        databases,
        workspaceId: room.workspaceId,
        userId: user.$id
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Create the message
      const message = await databases.createDocument(
        DATABASE_ID,
        CHAT_MESSAGES_ID,
        ID.unique(),
        {
          content,
          projectId,
          workspaceId: room.workspaceId,
          authorId: user.$id,
          authorName: user.name,
          createdAt: new Date().toISOString(),
        }
      );

      return c.json({ data: message });
    }
  )
  // Get messages for a project's chat room
  .get(
    "/messages/:projectId",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { projectId } = c.req.param();

      // Get the chat room first to verify workspace access
      const roomQuery = await databases.listDocuments(
        DATABASE_ID,
        CHAT_ROOMS_ID,
        [Query.equal("projectId", projectId)]
      );

      if (roomQuery.documents.length === 0) {
        return c.json({ 
          data: {
            documents: [],
            total: 0
          }
        });
      }

      const room = roomQuery.documents[0];

      // Verify user is a member of the workspace
      const member = await getMember({
        databases,
        workspaceId: room.workspaceId,
        userId: user.$id
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Get messages for this project
      const messages = await databases.listDocuments(
        DATABASE_ID,
        CHAT_MESSAGES_ID,
        [
          Query.equal("projectId", projectId),
          Query.orderDesc("$createdAt"),
          Query.limit(50) // Limit to last 50 messages
        ]
      );

      return c.json({ 
        data: {
          documents: messages.documents.reverse(), // Show oldest first
          total: messages.total 
        }
      });
    }
  );

export default app; 