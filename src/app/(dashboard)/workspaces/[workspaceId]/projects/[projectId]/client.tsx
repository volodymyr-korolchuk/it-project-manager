"use client";

import Link from "next/link";
import { PencilIcon, FileText, Plus } from "lucide-react";
import { useState } from "react";

import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { useGetDocuments } from "@/features/documents/api/use-get-documents";
import { DocumentList } from "@/features/documents/components/document-list";
import { CreateDocumentModal } from "@/features/documents/components/create-document-modal";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectAnalyticsDashboard } from "@/components/project-analytics-dashboard";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

export const ProjectIdClient = () => {
  const projectId = useProjectId();
  const [createDocumentOpen, setCreateDocumentOpen] = useState(false);
  
  const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
  const { data: analytics, isLoading: isLoadingAnalytics } = useGetProjectAnalytics({ projectId });
  const { data: documents, isLoading: isLoadingDocuments } = useGetDocuments({ projectId });

  const isLoading = isLoadingProject || isLoadingAnalytics;

  if (isLoading) {
    return <PageLoader />
  }

  if (!project) {
    return <PageError message="Project not found" />
  }

  return (
    <div className="flex flex-col gap-y-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}>
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6">
          <TaskViewSwitcher hideProjectFilter />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Project Documentation</h2>
                <p className="text-muted-foreground">
                  Create and manage project documentation
                </p>
              </div>
              <Button onClick={() => setCreateDocumentOpen(true)}>
                <Plus className="size-4 mr-2" />
                New Document
              </Button>
            </div>

            {isLoadingDocuments ? (
              <PageLoader />
            ) : (
              <DocumentList
                documents={documents?.documents || []}
                workspaceId={project.workspaceId}
                projectId={project.$id}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          {analytics ? (
            <ProjectAnalyticsDashboard data={analytics} />
          ) : null}
        </TabsContent>
      </Tabs>

      <CreateDocumentModal
        isOpen={createDocumentOpen}
        onClose={() => setCreateDocumentOpen(false)}
        projectId={project.$id}
      />
    </div>
  );
};
