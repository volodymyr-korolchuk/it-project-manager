import { z } from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { getMember } from "@/features/members/utils";
import { DATABASE_ID, DOCUMENTS_ID, PROJECTS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";

import { createDocumentSchema, updateDocumentSchema } from "../schemas";
import { Document } from "../types";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createDocumentSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { title, content, projectId, tags } = c.req.valid("json");

      // Get project to verify workspace access
      const project = await databases.getDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        databases,
        workspaceId: project.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const document = await databases.createDocument(
        DATABASE_ID,
        DOCUMENTS_ID,
        ID.unique(),
        {
          title,
          content,
          projectId,
          workspaceId: project.workspaceId,
          authorId: user.$id,
          tags: tags || [],
          lastEditedBy: user.name || user.email,
          version: 1,
        }
      );

      return c.json({ data: document });
    }
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ 
      projectId: z.string().optional(),
      workspaceId: z.string().optional(),
      search: z.string().optional(),
    })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { projectId, workspaceId, search } = c.req.valid("query");

      let workspaceIdToUse = workspaceId;

      // If projectId is provided, get workspace from project
      if (projectId) {
        const project = await databases.getDocument(
          DATABASE_ID,
          PROJECTS_ID,
          projectId
        );
        workspaceIdToUse = project.workspaceId;
      }

      if (!workspaceIdToUse) {
        return c.json({ error: "Workspace or project ID required" }, 400);
      }

      const member = await getMember({
        databases,
        workspaceId: workspaceIdToUse,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const queries = [
        Query.equal("workspaceId", workspaceIdToUse),
        Query.orderDesc("$updatedAt"),
      ];

      if (projectId) {
        queries.push(Query.equal("projectId", projectId));
      }

      if (search) {
        queries.push(Query.search("title", search));
      }

      const documents = await databases.listDocuments<Document>(
        DATABASE_ID,
        DOCUMENTS_ID,
        queries
      );

      return c.json({ data: documents });
    }
  )
  .get(
    "/:documentId",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { documentId } = c.req.param();

      const document = await databases.getDocument<Document>(
        DATABASE_ID,
        DOCUMENTS_ID,
        documentId
      );

      const member = await getMember({
        databases,
        workspaceId: document.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      return c.json({ data: document });
    }
  )
  .patch(
    "/:documentId",
    sessionMiddleware,
    zValidator("param", z.object({ documentId: z.string() })),
    zValidator("json", updateDocumentSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { documentId } = c.req.valid("param");
      const updates = c.req.valid("json");

      const existingDocument = await databases.getDocument(
        DATABASE_ID,
        DOCUMENTS_ID,
        documentId
      );

      if (!existingDocument) {
        return c.json({ error: "Document not found" }, 404);
      }

      const member = await getMember({
        databases,
        workspaceId: existingDocument.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Calculate new version if content changed
      let newVersion = existingDocument.version;
      if (updates.content && updates.content !== existingDocument.content) {
        newVersion = existingDocument.version + 1;
      }

      const document = await databases.updateDocument(
        DATABASE_ID,
        DOCUMENTS_ID,
        documentId,
        {
          title: updates.title ?? existingDocument.title,
          content: updates.content ?? existingDocument.content,
          tags: updates.tags ?? existingDocument.tags,
          lastEditedBy: user.name || user.email,
          version: newVersion,
        }
      );

      return c.json({ data: document });
    }
  )
  .delete(
    "/:documentId",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { documentId } = c.req.param();

      const document = await databases.getDocument<Document>(
        DATABASE_ID,
        DOCUMENTS_ID,
        documentId
      );

      const member = await getMember({
        databases,
        workspaceId: document.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await databases.deleteDocument(
        DATABASE_ID,
        DOCUMENTS_ID,
        documentId
      );

      return c.json({ data: { $id: document.$id } });
    }
  );

export default app; 