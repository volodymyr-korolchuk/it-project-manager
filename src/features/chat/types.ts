import { Models } from "node-appwrite";

export type ChatRoom = Models.Document & {
  projectId: string;
  workspaceId: string;
  name: string;
  description?: string;
};

export type ChatMessage = Models.Document & {
  content: string;
  projectId: string;
  workspaceId: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}; 