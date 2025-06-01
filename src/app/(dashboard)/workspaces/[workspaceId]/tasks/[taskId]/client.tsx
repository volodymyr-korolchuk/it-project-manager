"use client";

import { useState } from "react";
import { ArrowLeft, Clock, MessageSquare, Clipboard, MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { TaskDescription } from "@/features/tasks/components/task-description";
import { TimeTrackingButton } from "@/features/tasks/components/time-tracking-button";
import { TimeTrackingSummary } from "@/features/tasks/components/time-tracking-summary";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "@/features/tasks/hooks/use-edit-task-modal";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const workspaceId = useWorkspaceId();
  const { open: openEditModal } = useEditTaskModal();
  const [activeTab, setActiveTab] = useState("details");
  const { data: task, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />
  }

  if (!task) {
    return <PageError message="Task not found" />
  }

  return (
    <div className="h-full flex flex-col">
      {/* Navigation bar */}
      <div className="mb-2">
        <Link href={`/workspaces/${workspaceId}/tasks`} className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <Button variant="ghost" size="icon" className="h-8 w-8 mr-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Back to tasks</span>
        </Link>
      </div>
      
      {/* Breadcrumbs */}
      <div className="mb-3">
        <TaskBreadcrumbs project={task.project} task={task} />
      </div>

      {/* Header with title, status badge and actions */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{task.name}</h1>
        
        <div className="flex items-center gap-2">
          <Badge variant={task.status} className="px-3 py-1">
            {snakeCaseToTitleCase(task.status)}
          </Badge>
          
          <TimeTrackingButton task={task} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditModal(task.$id)}>
                Edit task
              </DropdownMenuItem>
              <DropdownMenuItem>
                Delete task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content with tabs */}
      <Card className="flex-1 shadow-sm overflow-hidden">
        <Tabs 
          defaultValue="details" 
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <div className="border-b bg-muted/20 px-6 py-2">
            <TabsList className="bg-transparent w-auto h-auto p-0 border-0">
              <TabsTrigger 
                value="details" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm border-0 rounded-md py-2 px-3"
              >
                <Clipboard className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="time" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm border-0 rounded-md py-2 px-3"
              >
                <Clock className="h-4 w-4 mr-2" />
                Time Tracking
              </TabsTrigger>
              <TabsTrigger 
                value="comments" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm border-0 rounded-md py-2 px-3"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comments
              </TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1 p-6">
            <TabsContent value="details" className="mt-0 h-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main content - 2/3 width on desktop */}
                <div className="md:col-span-2 space-y-6">
                  <TaskDescription task={task} />
                </div>
                
                {/* Sidebar - 1/3 width on desktop */}
                <div className="md:col-span-1">
                  <TaskOverview task={task} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="time" className="mt-0 h-full">
              <TimeTrackingSummary taskId={task.$id} />
            </TabsContent>
            
            <TabsContent value="comments" className="mt-0 h-full">
              <div className="p-4 border-standard rounded-lg bg-muted min-h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Comments feature coming soon</p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </Card>
    </div>
  );
};
