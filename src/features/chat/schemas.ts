import { z } from "zod";

export const createChatRoomSchema = z.object({
  projectId: z.string(),
  workspaceId: z.string(),
  name: z.string().min(1, "Room name is required"),
  description: z.string().optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  projectId: z.string(),
}); 