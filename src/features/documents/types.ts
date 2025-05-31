import { Models } from "node-appwrite";

export interface Document extends Models.Document {
  title: string;
  content: string; // JSON string of Editor.js data
  projectId: string;
  workspaceId: string;
  authorId: string;
  lastEditedBy: string;
  version: number;
  tags: string[];
}

export interface DocumentVersion extends Models.Document {
  documentId: string;
  version: number;
  content: string;
  authorId: string;
  changeDescription?: string;
} 