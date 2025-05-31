"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

import { useGetDocument } from '@/features/documents/api/use-get-document';
import { useUpdateDocument } from '@/features/documents/api/use-update-document';
import { useDocumentId } from '@/features/documents/hooks/use-document-id';
import { useProjectId } from '@/features/projects/hooks/use-project-id';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { RichTextEditor, RichTextEditorRef } from '@/features/documents/components/rich-text-editor';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageLoader } from '@/components/page-loader';
import { PageError } from '@/components/page-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export const DocumentIdClient = () => {
  const router = useRouter();
  const editorRef = useRef<RichTextEditorRef>(null);
  
  const documentId = useDocumentId();
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState<any>(undefined);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { data: document, isLoading, error } = useGetDocument({ documentId });
  const { mutate: updateDocument, isPending: isUpdating } = useUpdateDocument();

  // Initialize document data
  useEffect(() => {
    if (document) {
      setTitle(document.title || 'Untitled Document');
      try {
        const parsedContent = JSON.parse(document.content);
        
        // Handle different data structures
        let processedContent;
        if (parsedContent && Array.isArray(parsedContent)) {
          // Content is already an array of blocks
          processedContent = { blocks: parsedContent };
        } else if (parsedContent && parsedContent.blocks && Array.isArray(parsedContent.blocks)) {
          // Content has blocks property
          processedContent = parsedContent;
        } else {
          // Content is invalid or empty
          processedContent = { blocks: [] };
        }
        
        setContent(processedContent);
      } catch (error) {
        setContent({ blocks: [] });
      }
      setLastSaved(new Date(document.$updatedAt));
    }
  }, [document]);

  // Auto-save function
  const saveDocument = useCallback(async () => {
    if (!editorRef.current || !hasUnsavedChanges) return;

    setIsAutoSaving(true);
    try {
      const editorData = await editorRef.current.save();
      
      updateDocument({
        param: { documentId },
        json: {
          title,
          content: JSON.stringify(editorData),
        },
      }, {
        onSuccess: () => {
          setHasUnsavedChanges(false);
          setLastSaved(new Date());
          toast.success('Document saved');
        },
        onError: () => {
          toast.error('Failed to save document');
        }
      });
    } catch (error) {
      toast.error('Failed to save document');
    } finally {
      setIsAutoSaving(false);
    }
  }, [title, hasUnsavedChanges, documentId, updateDocument]);

  // Auto-save every 30 seconds if there are unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const autoSaveInterval = setInterval(() => {
      saveDocument();
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [hasUnsavedChanges, saveDocument]);

  // Prevent navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setHasUnsavedChanges(true);
  };

  const handleContentChange = (data: any) => {
    setContent(data);
    setHasUnsavedChanges(true);
  };

  const handleManualSave = async () => {
    if (!editorRef.current) {
      toast.error('Editor not ready');
      return;
    }
    
    try {
      const editorData = await editorRef.current.save();
      
      updateDocument({
        param: { documentId },
        json: {
          title,
          content: JSON.stringify(editorData),
        },
      }, {
        onSuccess: () => {
          setHasUnsavedChanges(false);
          setLastSaved(new Date());
          toast.success('Document saved successfully!');
        },
        onError: () => {
          toast.error('Failed to save document');
        }
      });
    } catch (error) {
      toast.error('Failed to save document');
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (confirmed) {
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
      }
    } else {
      // No unsaved changes, navigate back immediately
      router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !document) {
    return <PageError message="Document not found" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackClick}
                className="hover:bg-muted/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Button>
              
              <div className="h-6 w-px bg-border" />
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {lastSaved ? (
                  <span>Last saved {formatDistanceToNow(lastSaved, { addSuffix: true })}</span>
                ) : (
                  <span>Not saved yet</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  Unsaved changes
                </div>
              )}
              
              <Button 
                onClick={handleManualSave}
                disabled={!hasUnsavedChanges || isAutoSaving || isUpdating}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isAutoSaving || isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Unsaved changes warning */}
      {hasUnsavedChanges && (
        <div className="container mx-auto px-4 py-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              You have unsaved changes. They will be automatically saved every 30 seconds, or you can save manually.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Document Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-4xl font-bold border-0 shadow-none text-foreground placeholder:text-muted-foreground bg-transparent px-0 focus-visible:ring-0 h-auto py-2"
              placeholder="Untitled Document"
              style={{ fontSize: '2.25rem', lineHeight: '2.5rem' }}
            />
          </div>

          {/* Editor */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-8">
              <RichTextEditor
                ref={editorRef}
                data={content}
                onChange={handleContentChange}
                placeholder="Start writing your document..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 