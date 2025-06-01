"use client";

import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { Loader, PlusIcon } from "lucide-react";

import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { DataFilters } from "./data-filters";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DataKanban } from "./data-kanban";
import { DataCalendar } from "./data-calendar";

import { TaskStatus } from "../types";
import { useGetTasks } from "../api/use-get-tasks";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({ hideProjectFilter }: TaskViewSwitcherProps) => {
  const [{
    status,
    assigneeId,
    projectId,
    dueDate
  }] = useTaskFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();
  const { open } = useCreateTaskModal();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const { 
    data: tasks, 
    isLoading: isLoadingTasks
  } = useGetTasks({
    workspaceId,
    projectId: paramProjectId || projectId,
    assigneeId,
    status,
    dueDate,
  });

  const onKanbanChange = useCallback((
    tasks: { $id: string; status: TaskStatus; position: number }[]
  ) => {
    bulkUpdate({
      json: { tasks },
    });
  }, [bulkUpdate]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <ScrollArea className="w-full max-w-3xl">
          <div className="flex items-center space-x-4 pr-4">
            <Tabs defaultValue={view} onValueChange={(value) => setView(value)} className="mr-auto">
              <TabsList>
                <TabsTrigger value="table">List</TabsTrigger>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <DataFilters hideProjectFilter={hideProjectFilter} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        
        <Button onClick={open} size="sm">
          <PlusIcon className="size-4 mr-2" />
          New Task
        </Button>
      </div>
      
      {isLoadingTasks && (
        <div className="flex items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {!isLoadingTasks && view === "table" && (
        <DataTable data={tasks?.documents || []} columns={columns} />
      )}
      
      {!isLoadingTasks && view === "kanban" && (
        <DataKanban data={tasks?.documents || []} onChange={onKanbanChange} />
      )}
      
      {!isLoadingTasks && view === "calendar" && (
        <DataCalendar data={tasks?.documents || []} />
      )}
    </div>
  );
};
