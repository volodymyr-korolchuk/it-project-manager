import { WorkspaceAnalyticsResponseType } from "@/features/workspaces/api/use-get-workspace-analytics";

import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";

export const Analytics = ({ data }: WorkspaceAnalyticsResponseType) => {
  return (
    <div className="space-y-6">
      {/* Simplified header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Workspace Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Key metrics and performance indicators
        </p>
      </div>

      {/* Clean analytics grid */}
      <ScrollArea className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pb-2">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            variant={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          />
          
          <AnalyticsCard
            title="Assigned Tasks"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.assignedTaskDifference}
          />
          
          <AnalyticsCard
            title="Completed Tasks"
            value={data.completedTaskCount}
            variant={data.completedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.completedTaskDifference}
          />
          
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifference > 0 ? "down" : "up"}
            increaseValue={data.overdueTaskDifference}
          />
          
          <AnalyticsCard
            title="Incomplete Tasks"
            value={data.incompleteTaskCount}
            variant={data.incompleteTaskDifference > 0 ? "down" : "up"}
            increaseValue={data.incompleteTaskDifference}
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

