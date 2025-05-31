import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().default("{}"),
  projectId: z.string(),
  tags: z.array(z.string()).default([]),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
}); 