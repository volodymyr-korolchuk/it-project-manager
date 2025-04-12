"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { Task } from "@/features/tasks/types";
import { Member } from "@/features/members/types";
import { Project } from "@/features/projects/types";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";

import { Button } from "@/components/ui/button";
import { PageError } from "@/components/page-error";
import { Analytics } from "@/components/analytics";
import { PageLoader } from "@/components/page-loader";
import { Card, CardContent } from "@/components/ui/card";
import { MemberAvatar } from "@/features/members/components/member-avatar";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: analytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) {
    return <PageLoader />
  }

  if (!analytics || !tasks || !projects || !members) {
    return <PageError message="Failed to load workspace data" />
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <Analytics data={analytics} />
      
      {/* Tasks-Focused Layout */}
      <div className="grid grid-cols-1 gap-6">
        {/* Tasks Section - Hero/Main Focus Area */}
        <div className="w-full">
          <TaskList data={tasks.documents} total={tasks.total} />
        </div>
        
        {/* Secondary Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Members Section */}
          <div>
            <MembersList data={members.documents} total={members.total} />
          </div>
          
          {/* Projects Section - Reduced prominence */}
          <div>
            <ProjectList data={projects.documents} total={projects.total} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface TaskListProps {
  data: Task[];
  total: number;
};

export const TaskList = ({ data, total }: TaskListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTaskModal();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="bg-gradient-to-br from-card via-card to-card/50 border border-border/50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Tasks Dashboard</h2>
            <p className="text-muted-foreground mt-1">Manage and track your {total} active tasks</p>
          </div>
          <Button 
            variant="outline" 
            size="default" 
            onClick={createTask}
            className="border-border/50 hover:bg-background/50"
          >
            <PlusIcon className="size-4 mr-2" />
            Create New Task
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.slice(0, 9).map((task) => (
            <Link 
              key={task.$id} 
              href={`/workspaces/${workspaceId}/tasks/${task.$id}`}
              className="block"
            >
              <Card className="border-border/30 hover:border-border/60 bg-background/40 backdrop-blur-sm hover:bg-background/60 transition-all duration-200 group h-full">
                <CardContent className="p-5">
                  <div className="flex flex-col h-full">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-3">
                      {task.name}
                    </h3>
                    <div className="flex-1" />
                    <div className="space-y-2">
                      <div className="flex items-center gap-x-2">
                        <span className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium">
                          {task.project?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-x-2 text-xs text-muted-foreground">
                        <CalendarIcon className="size-3" />
                        <span>Due {formatDistanceToNow(new Date(task.dueDate))} from now</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {data.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No tasks yet</h3>
                <p className="text-sm text-muted-foreground/70 mb-4">Get started by creating your first task to organize your work</p>
                <Button onClick={createTask} variant="outline">
                  <PlusIcon className="size-4 mr-2" />
                  Create Your First Task
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {data.length > 9 && (
          <Button 
            variant="ghost" 
            className="w-full mt-6 border border-border/30 hover:bg-background/50" 
            asChild
          >
            <Link href={`/workspaces/${workspaceId}/tasks`}>
              View All {total} Tasks
            </Link>
          </Button>
        )}
        
        {data.length > 0 && data.length <= 9 && (
          <Button 
            variant="ghost" 
            className="w-full mt-6 border border-border/30 hover:bg-background/50" 
            asChild
          >
            <Link href={`/workspaces/${workspaceId}/tasks`}>
              View Tasks Board
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

interface ProjectListProps {
  data: Project[];
  total: number;
};

export const ProjectList = ({ data, total }: ProjectListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createProject } = useCreateProjectModal();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="bg-gradient-to-br from-card via-card to-card/50 border border-border/50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium tracking-tight">Projects</h2>
            <p className="text-sm text-muted-foreground mt-1">{total} active</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={createProject}
            className="border-border/50 hover:bg-background/50"
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {data.slice(0, 4).map((project) => (
            <Link 
              key={project.$id} 
              href={`/workspaces/${workspaceId}/projects/${project.$id}`}
              className="block"
            >
              <Card className="border-border/30 hover:border-border/60 bg-background/40 backdrop-blur-sm hover:bg-background/60 transition-all duration-200 group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-x-3">
                    <ProjectAvatar
                      className="size-10 flex-shrink-0"
                      fallbackClassName="text-sm"
                      name={project.name}
                      image={project.imageUrl}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Active Project
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {data.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No projects</p>
              <Button 
                onClick={createProject} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                <PlusIcon className="size-4 mr-2" />
                Create Project
              </Button>
            </div>
          )}
        </div>
        
        {data.length > 0 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4 border border-border/30 hover:bg-background/50" 
            asChild
            size="sm"
          >
            <Link href={`/workspaces/${workspaceId}/projects`}>
              View All ({total})
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

interface MembersListProps {
  data: Member[];
  total: number;
};

export const MembersList = ({ data, total }: MembersListProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-6 h-fit">
      <div className="bg-gradient-to-br from-card via-card to-card/50 border border-border/50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-medium tracking-tight">Team</h2>
            <p className="text-sm text-muted-foreground mt-1">{total} members</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="border-border/50 hover:bg-background/50"
          >
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 mr-2" />
              Manage
            </Link>
          </Button>
        </div>
        
        <div className="space-y-3">
          {data.slice(0, 6).map((member) => (
            <div key={member.$id} className="flex items-center gap-x-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors">
              <MemberAvatar
                className="size-10 flex-shrink-0"
                name={member.name}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">
                  {member.name}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {member.email}
                </p>
              </div>
            </div>
          ))}
          
          {data.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">No members found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Invite team members to collaborate</p>
            </div>
          )}
        </div>
        
        {data.length > 6 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4 border border-border/30 hover:bg-background/50" 
            asChild
          >
            <Link href={`/workspaces/${workspaceId}/members`}>
              View All Members ({total})
            </Link>
          </Button>
        )}
        
        {data.length > 0 && data.length <= 6 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4 border border-border/30 hover:bg-background/50" 
            asChild
          >
            <Link href={`/workspaces/${workspaceId}/members`}>
              Manage Team
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};
