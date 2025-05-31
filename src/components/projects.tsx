"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { HiPlus, HiDocumentText, HiChartBar, HiViewGrid } from "react-icons/hi";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";

interface Project {
  $id: string;
  name: string;
  imageUrl?: string;
}

const projectSubItems = [
  {
    label: "Overview",
    href: "",
    icon: HiViewGrid,
  },
  {
    label: "Documentation",
    href: "/documents",
    icon: HiDocumentText,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: HiChartBar,
  },
];

export const Projects = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const { open } = useCreateProjectModal();
  const workspaceId = useWorkspaceId();
  const { data } = useGetProjects({
    workspaceId,
  });

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const isProjectExpanded = (projectId: string) => expandedProjects.has(projectId);

  const isSubItemActive = (projectId: string, subHref: string) => {
    const fullHref = `/workspaces/${workspaceId}/projects/${projectId}${subHref}`;
    return pathname === fullHref;
  };

  const isProjectActive = (projectId: string) => {
    return pathname.includes(`/projects/${projectId}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={toggleExpanded}
          className="flex items-center gap-1 text-xs uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          Projects
          {data?.documents && data.documents.length > 0 && (
            <span className="ml-1 bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded-full">
              {data.documents.length}
            </span>
          )}
        </button>
        <button
          onClick={open}
          className="p-1 rounded-md hover:bg-accent transition-colors"
        >
          <HiPlus className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      </div>
      
      {isExpanded && (
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {data?.documents && data.documents.length > 0 ? (
              data.documents.map((project: Project) => {
                const isProjectCurrentlyExpanded = isProjectExpanded(project.$id);
                const isActive = isProjectActive(project.$id);

                return (
                  <div key={project.$id} className="space-y-1">
                    {/* Project Header */}
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleProject(project.$id)}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-md hover:bg-accent transition cursor-pointer text-muted-foreground flex-1",
                          isActive && "text-primary"
                        )}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex-shrink-0">
                            {isProjectCurrentlyExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </div>
                          <ProjectAvatar 
                            name={project.name} 
                            image={project.imageUrl}
                            className="flex-shrink-0" 
                          />
                          <span className="truncate text-sm font-medium">{project.name}</span>
                        </div>
                      </button>
                    </div>

                    {/* Project Sub-items */}
                    {isProjectCurrentlyExpanded && (
                      <div className="ml-6 space-y-1">
                        {projectSubItems.map((subItem) => {
                          const fullHref = `/workspaces/${workspaceId}/projects/${project.$id}${subItem.href}`;
                          const isSubActive = isSubItemActive(project.$id, subItem.href);

                          return (
                            <Link key={subItem.href} href={fullHref}>
                              <div
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition cursor-pointer",
                                  isSubActive 
                                    ? "bg-accent text-primary font-medium" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                )}
                              >
                                <subItem.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{subItem.label}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-muted-foreground mb-2">No projects yet</p>
                <button 
                  onClick={open}
                  className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Create your first project
                </button>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
