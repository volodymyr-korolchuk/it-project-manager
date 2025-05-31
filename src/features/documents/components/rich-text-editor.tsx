"use client";

import React, { useEffect, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

interface RichTextEditorProps {
  data?: any;
  onChange?: (data: any) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export interface RichTextEditorRef {
  save: () => Promise<any>;
  clear: () => void;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ data, onChange, placeholder = "Start writing your document...", readOnly = false }, ref) => {
    const [isMounted, setIsMounted] = useState(false);

    // Memoize the initial content to prevent unnecessary recreations
    const initialContent = useMemo(() => {
      if (data && data.blocks && Array.isArray(data.blocks) && data.blocks.length > 0) {
        return data.blocks;
      }
      return undefined; // Let BlockNote create default content
    }, []);

    // Create the BlockNote editor
    const editor = useCreateBlockNote({
      initialContent,
      placeholders: {
        default: placeholder,
      },
    });

    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Memoize the stringified data to prevent infinite loops
    const dataString = useMemo(() => {
      return data ? JSON.stringify(data) : '';
    }, [data]);

    // Update editor content when data changes, but only if it's different from current content
    useEffect(() => {
      if (editor && data && data.blocks && Array.isArray(data.blocks)) {
        const currentBlocks = editor.document;
        const currentString = JSON.stringify({ blocks: currentBlocks });
        
        // Only update if the content is actually different
        if (currentString !== dataString) {
          editor.replaceBlocks(currentBlocks, data.blocks);
        }
      }
    }, [editor, dataString]); // Use stringified data instead of object reference

    // Handle editor changes
    const handleEditorChange = React.useCallback(() => {
      if (onChange) {
        const blocks = editor.document;
        onChange({ blocks });
      }
    }, [editor, onChange]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      save: async () => {
        const blocks = editor.document;
        return { blocks };
      },
      clear: () => {
        editor.replaceBlocks(editor.document, []);
      },
    }), [editor]);

    if (!isMounted) {
      return (
        <div 
          className="min-h-[200px] border border-border rounded-lg p-4 bg-background flex items-center justify-center text-muted-foreground"
        >
          Loading editor...
        </div>
      );
    }

    return (
      <div className="blocknote-editor-container">
        <BlockNoteView 
          editor={editor} 
          onChange={handleEditorChange}
          theme="dark"
        />
        <style jsx global>{`
          .blocknote-editor-container {
            min-height: 500px;
            background-color: hsl(var(--background)) !important;
          }
          
          .bn-container {
            font-family: inherit !important;
            background-color: hsl(var(--background)) !important;
            color: hsl(var(--foreground)) !important;
            padding: 0 !important;
          }
          
          .bn-editor {
            background-color: hsl(var(--background)) !important;
            color: hsl(var(--foreground)) !important;
            padding: 0 !important;
          }
          
          .bn-block-content {
            margin: 0.5em 0 !important;
            background-color: transparent !important;
            color: hsl(var(--foreground)) !important;
            padding: 0 !important;
          }
          
          .bn-inline-content {
            line-height: 1.7 !important;
            font-size: 16px !important;
            color: hsl(var(--foreground)) !important;
            background-color: transparent !important;
            padding: 0 !important;
          }
          
          .ProseMirror {
            background-color: hsl(var(--background)) !important;
            color: hsl(var(--foreground)) !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          .bn-toolbar {
            background-color: hsl(var(--card)) !important;
            border-color: hsl(var(--border)) !important;
          }
          
          .bn-menu {
            background-color: hsl(var(--popover)) !important;
            border-color: hsl(var(--border)) !important;
          }
          
          .bn-inline-content[data-placeholder]::before {
            color: hsl(var(--muted-foreground)) !important;
          }
        `}</style>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor'; 