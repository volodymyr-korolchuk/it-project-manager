"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCreateDocument } from "@/features/documents/api/use-create-document";
import { createDocumentSchema } from "@/features/documents/schemas";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreateDocumentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

type FormData = z.infer<typeof createDocumentSchema>;

export const CreateDocumentModal = ({
  isOpen,
  onOpenChange,
  projectId,
}: CreateDocumentModalProps) => {
  const { mutate, isPending } = useCreateDocument();

  const form = useForm<FormData>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      title: "",
      content: "{}",
      projectId,
      tags: [],
    },
  });

  const onSubmit = (values: FormData) => {
    mutate({
      json: values,
    }, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg p-7">
        <DialogHeader className="flex flex-col gap-y-4">
          <DialogTitle className="text-xl font-bold">
            Create New Document
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Enter document title..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Document"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 