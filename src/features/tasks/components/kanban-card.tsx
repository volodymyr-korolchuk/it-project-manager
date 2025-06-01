import { MoreHorizontal } from "lucide-react";

import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

import { DottedSeparator } from "@/components/dotted-separator";

import { TaskDate } from "./task-date";
import { TaskActions } from "./task-actions";
import { TimeTrackingButton } from "./time-tracking-button";

import { Task } from "../types";

interface KanbanCardProps {
  task: Task;
};

export const KanbanCard = ({ task }: KanbanCardProps) => {
  return (
    <div className="bg-card border-subtle p-3 mb-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 space-y-3 group hover:border-active cursor-grab active:cursor-grabbing">
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {task.name}
        </p>
        <TaskActions id={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="size-4 shrink-0 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100" />
        </TaskActions>
      </div>
      
      <DottedSeparator className="opacity-50" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <MemberAvatar
            name={task.assignee.name}
            fallbackClassName="text-[10px]"
            className="size-5"
          />
          <div className="size-1 rounded-full bg-muted-foreground/30" />
          <TaskDate value={task.dueDate} className="text-xs text-muted-foreground" />
        </div>
        <TimeTrackingButton task={task} />
      </div>
      
      <div className="flex items-center gap-x-2">
        <ProjectAvatar
          name={task.project.name}
          image={task.project.imageUrl}
          fallbackClassName="text-[10px]"
          className="size-5"
        />
        <span className="text-xs font-medium text-muted-foreground truncate">
          {task.project.name}
        </span>
      </div>
    </div>
  );
};
