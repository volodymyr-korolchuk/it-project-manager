import { PencilIcon, Calendar, User, ListChecks, ArrowRightCircle } from "lucide-react";

import { MemberAvatar } from "@/features/members/components/member-avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { snakeCaseToTitleCase } from "@/lib/utils";

import { TaskDate } from "./task-date";

import { Task, TaskStatus } from "../types";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { useUpdateTask } from "../api/use-update-task";

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview = ({
  task
}: TaskOverviewProps) => {
  const { open } = useEditTaskModal();
  const { mutate: updateTask } = useUpdateTask();
  
  const handleStatusChange = (status: TaskStatus) => {
    updateTask({
      json: { status },
      param: { taskId: task.$id }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between px-6 py-4 bg-card">
        <CardTitle className="text-xl">Details</CardTitle>
        <Button 
          onClick={() => open(task.$id)} 
          variant="outline" 
          size="sm"
          className="gap-2"
        >
          <PencilIcon className="h-4 w-4" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="px-6 py-4 space-y-6">
        {/* Status with quick change capability */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Status
          </div>
          <Select 
            defaultValue={task.status} 
            onValueChange={(value) => handleStatusChange(value as TaskStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <Badge variant={task.status}>
                    {snakeCaseToTitleCase(task.status)}
                  </Badge>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  <div className="flex items-center gap-2">
                    <Badge variant={status}>
                      {snakeCaseToTitleCase(status)}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Assignee */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <User className="h-4 w-4" />
            Assignee
          </div>
          <div className="flex items-center gap-2 p-2 border-subtle rounded-md bg-muted/20">
            <MemberAvatar
              name={task.assignee.name}
              className="h-8 w-8"
            />
            <div>
              <p className="font-medium">{task.assignee.name}</p>
              <p className="text-xs text-muted-foreground">Assigned</p>
            </div>
          </div>
        </div>
        
        {/* Due Date */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Due Date
          </div>
          <div className="flex items-center gap-2 p-2 border-subtle rounded-md bg-muted/20">
            <TaskDate value={task.dueDate} className="font-medium" />
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => {
              // Logic to advance task to next status
              const statuses = Object.values(TaskStatus);
              const currentIndex = statuses.indexOf(task.status);
              if (currentIndex < statuses.length - 1) {
                handleStatusChange(statuses[currentIndex + 1]);
              }
            }}
            disabled={task.status === TaskStatus.DONE}
          >
            <ArrowRightCircle className="h-4 w-4" />
            Move to Next Stage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
