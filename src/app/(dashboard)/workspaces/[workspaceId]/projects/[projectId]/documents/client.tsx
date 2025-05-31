"use client";

import Link from "next/link";
import { PencilIcon, Plus } from "lucide-react";
import { HiViewGrid, HiDocumentText, HiChartBar } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetDocuments } from "@/features/documents/api/use-get-documents";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { DocumentList } from "@/features/documents/components/document-list";
import { CreateDocumentModal } from "@/features/documents/components/create-document-modal";

import { Button } from "@/components/ui/button";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { cn } from "@/lib/utils";

const projectTabs = [
  {
    label: "Overview",
    value: "overview",
    href: "",
    icon: HiViewGrid,
  },
  {
    label: "Documentation", 
    value: "documents",
    href: "/documents",
    icon: HiDocumentText,
  },
  {
    label: "Analytics",
    value: "analytics", 
    href: "/analytics",
    icon: HiChartBar,
  },
];

export const DocumentsClient = () => {
  const [createDocumentOpen, setCreateDocumentOpen] = useState(false);
  const projectId = useProjectId();
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  
  const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
  const { data: documents, isLoading: isLoadingDocuments } = useGetDocuments({ projectId });

  const isLoading = isLoadingProject || isLoadingDocuments;

  if (isLoading) {
    return <PageLoader />
  }

  if (!project) {
    return <PageError message="Project not found" />
  }

  return (
    <div className="flex flex-col gap-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-10"
          />
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-sm text-muted-foreground">Project Documentation</p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}>
            <PencilIcon className="size-4 mr-2" />
            Edit Project
          </Link>
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8 -mb-px">
          {projectTabs.map((tab) => {
            const fullHref = `/workspaces/${workspaceId}/projects/${projectId}${tab.href}`;
            const isActive = pathname === fullHref;
            const Icon = tab.icon;

            return (
              <Link key={tab.value} href={fullHref}>
                <div
                  className={cn(
                    "flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors",
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Documents Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Project Documentation</h2>
            <p className="text-sm text-muted-foreground">
              Create and manage project documentation
            </p>
          </div>
          <Button onClick={() => setCreateDocumentOpen(true)}>
            <Plus className="size-4 mr-2" />
            New Document
          </Button>
        </div>

        <DocumentList
          documents={documents?.documents || []}
          workspaceId={project.workspaceId}
          projectId={project.$id}
        />
      </div>

      <CreateDocumentModal
        isOpen={createDocumentOpen}
        onOpenChange={setCreateDocumentOpen}
        projectId={project.$id}
      />
    </div>
  );
}; 