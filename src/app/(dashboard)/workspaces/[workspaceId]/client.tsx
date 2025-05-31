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

import { Button } from "@/components/ui/button";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Card, CardContent } from "@/components/ui/card";
import { MemberAvatar } from "@/features/members/components/member-avatar";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const isLoading =
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) {
    return <PageLoader />
  }

  if (!tasks || !projects || !members) {
    return <PageError message="Failed to load workspace data" />
  }

  return (
    <div className="h-full flex flex-col space-y-6">
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "BACKLOG": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "TODO": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "IN_PROGRESS": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "IN_REVIEW": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "DONE": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="relative">
        <div className="relative bg-gradient-to-br from-card via-card to-card/80 border border-border/50 rounded-2xl p-8 shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Subtle decorative gradients */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-2xl" />
          
          <div className="relative flex items-center justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    Tasks Dashboard
                  </h2>
                  <p className="text-muted-foreground">
                    Manage and track your <span className="font-semibold text-foreground">{total}</span> active tasks
                  </p>
                </div>
              </div>
              
              {/* Quick stats */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-emerald-400/60 rounded-full" />
                  <span className="text-muted-foreground">
                    {data.filter(task => task.status === "DONE").length} completed
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-400/60 rounded-full" />
                  <span className="text-muted-foreground">
                    {data.filter(task => task.status === "IN_PROGRESS").length} in progress
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-400/60 rounded-full" />
                  <span className="text-muted-foreground">
                    {data.filter(task => new Date(task.dueDate) < new Date()).length} overdue
                  </span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={createTask}
              size="lg"
              variant="outline"
              className="relative bg-background border-border/60 hover:border-border hover:bg-background/80 text-foreground shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <PlusIcon className="size-4 mr-2" />
              Create New Task
            </Button>
          </div>
        </div>
      </div>

      {/* Unified Tasks Grid */}
      <div className="relative">
        {data.length > 0 ? (
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <div className="relative space-y-6">
              {/* Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {data.slice(0, 9).map((task, index) => (
                  <Link 
                    key={task.$id} 
                    href={`/workspaces/${workspaceId}/tasks/${task.$id}`}
                    className="block group"
                  >
                    <div className="relative h-full border border-border/30 bg-background hover:border-border/60 hover:bg-background/80 rounded-xl p-5 transition-all duration-200 group-hover:shadow-sm">
                      <div className="relative h-full flex flex-col space-y-4">
                        {/* Task header */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-foreground transition-colors line-clamp-2 leading-tight text-base">
                            {task.name}
                          </h3>
                          
                          {task.description && (
                            <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-1" />
                        
                        {/* Task metadata */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                            
                            {task.project && (
                              <span className="px-2 py-1 bg-muted/40 text-muted-foreground rounded-md text-xs font-medium truncate max-w-[100px]">
                                {task.project.name}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground/70">
                              <CalendarIcon className="size-3" />
                              <span>Due {formatDistanceToNow(new Date(task.dueDate))} from now</span>
                            </div>
                            
                            {/* Priority indicator */}
                            <div className="flex items-center gap-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                task.status === "DONE" ? "bg-emerald-400/60" :
                                new Date(task.dueDate) < new Date() ? "bg-red-400/60" : "bg-blue-400/60"
                              }`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* View more section */}
              <div className="flex justify-center pt-2">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group border-border/50 hover:border-border/70 bg-background/50 hover:bg-background/70 transition-all duration-200" 
                  asChild
                >
                  <Link href={`/workspaces/${workspaceId}/tasks`} className="flex items-center gap-2">
                    {data.length > 9 ? `View All ${total} Tasks` : "View Tasks Board"}
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-muted/20 to-muted/10 flex items-center justify-center">
                      <div className="w-1 h-1 bg-current rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Enhanced empty state */
          <div className="relative">
            <div className="text-center py-16 px-8 bg-card border border-border/30 rounded-2xl">
              {/* Decorative elements */}
              <div className="absolute top-6 left-6 w-8 h-8 bg-gradient-to-br from-blue-400/10 to-emerald-400/10 rounded-full" />
              <div className="absolute bottom-6 right-6 w-6 h-6 bg-gradient-to-br from-purple-400/10 to-blue-400/10 rounded-full" />
              
              <div className="relative space-y-6">
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl flex items-center justify-center">
                    <PlusIcon className="size-8 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">No tasks yet</h3>
                  <p className="text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
                    Get started by creating your first task to organize your work and track progress
                  </p>
                </div>
                
                <Button 
                  onClick={createTask} 
                  size="lg"
                  variant="outline"
                  className="bg-background border-border/60 hover:border-border hover:bg-background/80 text-foreground shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <PlusIcon className="size-4 mr-2" />
                  Create Your First Task
                </Button>
              </div>
            </div>
          </div>
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
    <div className="relative">
      <div className="bg-gradient-to-br from-card via-card/95 to-card/80 border border-border/50 rounded-xl p-6 shadow-sm backdrop-blur-sm overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full blur-xl" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-5 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Projects</h2>
              </div>
              <p className="text-sm text-muted-foreground ml-3">
                {total} active project{total !== 1 ? 's' : ''}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={createProject}
              className="border-border/50 hover:border-border/70 bg-background/30 hover:bg-background/50 transition-all duration-200"
            >
              <PlusIcon className="size-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {data.slice(0, 4).map((project) => (
              <Link 
                key={project.$id} 
                href={`/workspaces/${workspaceId}/projects/${project.$id}`}
                className="block group"
              >
                <Card className="border-border/30 hover:border-border/60 bg-gradient-to-r from-background/50 to-background/30 hover:from-background/70 hover:to-background/50 transition-all duration-200 group-hover:shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <ProjectAvatar
                        className="size-10 flex-shrink-0 ring-2 ring-border/30 group-hover:ring-border/50 transition-all duration-200"
                        fallbackClassName="text-sm font-medium"
                        name={project.name}
                        image={project.imageUrl}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-blue-400 transition-colors line-clamp-1">
                          {project.name}
                        </h3>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          Active Project
                        </p>
                      </div>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-1.5 h-1.5 bg-blue-400/60 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            
            {data.length === 0 && (
              <div className="text-center py-8">
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl flex items-center justify-center">
                    <PlusIcon className="size-6 text-muted-foreground/60" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">No projects</p>
                    <p className="text-xs text-muted-foreground/70">Create your first project to get started</p>
                  </div>
                  <Button 
                    onClick={createProject} 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-border/50 hover:border-border/70"
                  >
                    <PlusIcon className="size-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {data.length > 0 && (
            <Button 
              variant="ghost" 
              className="w-full mt-4 border border-border/30 hover:border-border/50 hover:bg-background/30 transition-all duration-200 text-sm" 
              asChild
              size="sm"
            >
              <Link href={`/workspaces/${workspaceId}/projects`}>
                View All Projects ({total})
              </Link>
            </Button>
          )}
        </div>
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
    <div className="relative">
      <div className="bg-gradient-to-br from-card via-card/95 to-card/80 border border-border/50 rounded-xl p-6 shadow-sm backdrop-blur-sm overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-xl" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-5 bg-gradient-to-b from-emerald-400 to-green-400 rounded-full" />
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Team Members</h2>
              </div>
              <p className="text-sm text-muted-foreground ml-3">
                {total} member{total !== 1 ? 's' : ''} in workspace
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="border-border/50 hover:border-border/70 bg-background/30 hover:bg-background/50 transition-all duration-200"
            >
              <Link href={`/workspaces/${workspaceId}/members`}>
                <SettingsIcon className="size-4 mr-2" />
                Manage
              </Link>
            </Button>
          </div>
          
          <div className="space-y-3">
            {data.slice(0, 6).map((member) => (
              <div key={member.$id} className="group">
                <Card className="border-border/30 hover:border-border/60 bg-gradient-to-r from-background/50 to-background/30 hover:from-background/70 hover:to-background/50 transition-all duration-200 group-hover:shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MemberAvatar
                        className="size-10 flex-shrink-0 ring-2 ring-border/30 group-hover:ring-border/50 transition-all duration-200"
                        fallbackClassName="text-sm font-medium"
                        name={member.name}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {member.name}
                        </h3>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {member.email}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-400/60 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {data.length === 0 && (
              <div className="text-center py-8">
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl flex items-center justify-center">
                    <SettingsIcon className="size-6 text-muted-foreground/60" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">No team members</p>
                    <p className="text-xs text-muted-foreground/70">Invite people to collaborate</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {data.length > 6 && (
            <Button 
              variant="ghost" 
              className="w-full mt-4 border border-border/30 hover:border-border/50 hover:bg-background/30 transition-all duration-200 text-sm" 
              asChild
              size="sm"
            >
              <Link href={`/workspaces/${workspaceId}/members`}>
                View All Members ({total})
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
