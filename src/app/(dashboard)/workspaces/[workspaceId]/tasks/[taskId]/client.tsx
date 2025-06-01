"use client";

import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { TaskOverview } from "@/features/tasks/components/task-overview";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { TaskDescription } from "@/features/tasks/components/task-description";
import { TimeTrackingButton } from "@/features/tasks/components/time-tracking-button";
import { TimeTrackingSummary } from "@/features/tasks/components/time-tracking-summary";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { DottedSeparator } from "@/components/dotted-separator";

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />
  }

  if (!data) {
    return <PageError message="Task not found" />
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <TaskBreadcrumbs project={data.project} task={data} />
        <TimeTrackingButton task={data} />
      </div>
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
        <TimeTrackingSummary taskId={data.$id} />
      </div>
    </div>
  );
};
