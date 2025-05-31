"use client";

import { useState } from "react";
import { MessageCircle, Users } from "lucide-react";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { ChatRoom } from "@/features/chat/components/chat-room";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { cn } from "@/lib/utils";

interface Project {
  $id: string;
  name: string;
  imageUrl?: string;
  workspaceId: string;
}

export const ChatClient = () => {
  const workspaceId = useWorkspaceId();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });

  if (isLoadingProjects) {
    return <PageLoader />
  }

  if (!projects) {
    return <PageError message="Failed to load projects" />
  }

  const projectList = projects.documents || [];

  return (
    <div className="h-full flex flex-col space-y-6 pb-4">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-card via-card/95 to-card/80 rounded-xl blur-xl" />
        <div className="relative bg-gradient-to-br from-card via-card/95 to-card/80 border border-border/50 rounded-xl p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-sm">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-blue-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Team Chat</h1>
              <p className="text-sm text-muted-foreground">Connect with your project teams</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0 max-h-[calc(100vh-20rem)] mb-4">
        {/* Project Selector */}
        <div className="lg:col-span-1">
          <div className="relative h-full max-h-[480px]">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full blur-2xl" />
            
            <Card className="h-full border-border/50 bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm shadow-sm relative flex flex-col">
              <CardHeader className="pb-3 border-b border-border/30 bg-gradient-to-r from-card/60 to-card/40 flex-shrink-0">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent" />
                <CardTitle className="flex items-center gap-2 text-sm">
                  <div className="w-0.5 h-3 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
                  <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-foreground">Rooms</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0 flex-1 min-h-0">
                <ScrollArea className="h-full max-h-[380px] chat-scrollbar-enhanced">
                  <div className="p-3 space-y-2">
                    {projectList.length === 0 ? (
                      <div className="text-center py-6 px-3">
                        <div className="w-8 h-8 mx-auto bg-gradient-to-br from-muted/30 to-muted/20 rounded-lg flex items-center justify-center mb-2">
                          <MessageCircle className="h-4 w-4 text-muted-foreground/60" />
                        </div>
                        <p className="text-xs text-muted-foreground/70 leading-relaxed">No projects available</p>
                        <p className="text-xs text-muted-foreground/50 mt-1">Create a project to start chatting</p>
                      </div>
                    ) : (
                      projectList.map((project: Project) => {
                        const isSelected = selectedProject?.$id === project.$id;
                        
                        return (
                          <div
                            key={project.$id}
                            className={cn(
                              "w-full p-3 transition-all duration-200 group relative cursor-pointer rounded-lg border",
                              isSelected 
                                ? "bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-sm" 
                                : "hover:bg-accent/30 border-transparent hover:border-border/20"
                            )}
                            onClick={() => setSelectedProject(project)}
                          >
                            {isSelected && (
                              <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-primary to-primary/70 rounded-r" />
                            )}
                            
                            <div className="flex items-start gap-3 w-full">
                              <ProjectAvatar
                                name={project.name}
                                image={project.imageUrl}
                                className={cn(
                                  "size-8 ring-1 transition-all duration-200 flex-shrink-0 mt-1",
                                  isSelected 
                                    ? "ring-primary/30" 
                                    : "ring-border/20 group-hover:ring-border/30"
                                )}
                              />
                              <div className="flex-1 min-w-0 space-y-1">
                                <p className={cn(
                                  "font-medium text-sm transition-colors duration-200 leading-snug break-all hyphens-auto",
                                  isSelected ? "text-primary" : "text-foreground"
                                )}
                                style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                                >
                                  {project.name}
                                </p>
                                <p className={cn(
                                  "text-xs transition-colors duration-200 leading-relaxed",
                                  isSelected ? "text-primary/60" : "text-muted-foreground/60"
                                )}>
                                  Team Chat
                                </p>
                              </div>
                              
                              {isSelected && (
                                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse flex-shrink-0 mt-2" />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chat Room */}
        <div className="lg:col-span-3">
          {selectedProject ? (
            <ChatRoom
              projectId={selectedProject.$id}
              workspaceId={selectedProject.workspaceId}
              projectName={selectedProject.name}
            />
          ) : (
            <div className="relative h-full">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-tl from-purple-500/5 to-transparent rounded-full blur-3xl" />
              
              <Card className="h-full border-border/50 bg-gradient-to-br from-card via-card/95 to-card/80 backdrop-blur-sm shadow-sm relative">
                <CardContent className="flex items-center justify-center h-full p-12">
                  <div className="text-center space-y-8 max-w-lg">
                    <div className="relative">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-border/20 shadow-sm">
                        <MessageCircle className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full animate-ping" />
                      <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full animate-ping animation-delay-1000" />
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-foreground">Select a Project Room</h3>
                      <div className="space-y-3">
                        <p className="text-base text-muted-foreground leading-relaxed">
                          Choose a project from the sidebar to start chatting with your team members.
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground/70">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400/60 rounded-full" />
                            <span>Real-time messaging</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-400/60 rounded-full" />
                            <span>Secure conversations</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3 pt-4">
                      <div className="w-2 h-2 bg-blue-400/40 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400/40 rounded-full animate-bounce animation-delay-200" />
                      <div className="w-2 h-2 bg-green-400/40 rounded-full animate-bounce animation-delay-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 