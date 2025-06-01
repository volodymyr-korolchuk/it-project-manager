"use client";

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  FileText, 
  Trash2,
  MoreHorizontal,
  Clock,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Document } from '../types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DocumentListProps {
  documents: Document[];
  workspaceId: string;
  projectId: string;
}

const getContentPreview = (content: string): string => {
  try {
    const parsed = JSON.parse(content);
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      for (const block of parsed.blocks) {
        if (block.content && Array.isArray(block.content)) {
          const textContent = block.content
            .filter((item: any) => item.type === 'text')
            .map((item: any) => item.text)
            .join(' ');
          if (textContent.trim()) {
            return textContent.trim();
          }
        }
      }
    }
    return "No content yet";
  } catch {
    return "No content yet";
  }
};

const formatLastEditedBy = (lastEditedBy: string): string => {
  if (lastEditedBy.length > 20 && /^[a-zA-Z0-9]+$/.test(lastEditedBy)) {
    return "Unknown user";
  }
  return lastEditedBy;
};

export const DocumentList = ({
  documents,
  workspaceId,
  projectId,
}: DocumentListProps) => {
  const router = useRouter();

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No documents yet
        </h3>
        <p className="text-muted-foreground text-center max-w-md leading-relaxed">
          Create your first document to start building your project documentation and knowledge base.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {documents.map((document) => {
        const contentPreview = getContentPreview(document.content);
        
        return (
          <Card 
            key={document.$id} 
            className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 cursor-pointer flex flex-col h-full"
            onClick={() => router.push(`/workspaces/${workspaceId}/projects/${projectId}/documents/${document.$id}`)}
          >
            <CardHeader className="pb-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-foreground leading-tight line-clamp-2 mb-2">
                    {document.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {formatDistanceToNow(new Date(document.$updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/workspaces/${workspaceId}/projects/${projectId}/documents/${document.$id}`);
                      }}
                    >
                      <FileText className="h-4 w-4 mr-3" />
                      Open Document
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-3" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 min-h-[3.75rem]">
                  {contentPreview}
                </p>
              </div>
            </CardHeader>

            <CardContent className="pt-0 pb-5 flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs font-medium px-3 py-1.5 bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200">
                    v{document.version}
                  </Badge>
                </div>
                
                {document.tags && document.tags.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {document.tags.slice(0, 2).map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs px-2.5 py-1 text-muted-foreground border-muted-foreground/30 hover:bg-muted/50"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {document.tags.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs px-2.5 py-1 text-muted-foreground border-muted-foreground/30 hover:bg-muted/50"
                      >
                        +{document.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-3 mt-auto border-t border-border/50">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Last edited by {formatLastEditedBy(document.lastEditedBy)}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}; 