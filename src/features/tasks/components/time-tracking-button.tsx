import { PlayIcon, PauseIcon, Timer } from "lucide-react";

import { Task } from "../types";
import { useTaskTimeTracking } from "../api/use-task-time-tracking";
import { formatTime } from "@/lib/format-time";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TimeTrackingButtonProps {
  task: Task;
  variant?: "icon" | "default";
  className?: string;
}

export function TimeTrackingButton({
  task,
  variant = "default",
  className = "",
}: TimeTrackingButtonProps) {
  const {
    startTracking,
    stopTracking,
    isStartingTracking,
    isStoppingTracking,
    elapsedTime,
  } = useTaskTimeTracking(task.$id);
  
  const isTracking = task.isTracking;
  const totalTime = (task.timeTracked || 0) + (isTracking ? elapsedTime : 0);
  const formattedTime = formatTime(totalTime);
  
  const handleClick = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };
  
  if (variant === "icon") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            disabled={isStartingTracking || isStoppingTracking}
            className={`rounded-full h-8 w-8 ${className}`}
          >
            {isTracking ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isTracking ? "Stop tracking" : "Start tracking"}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return (
    <Button
      variant={isTracking ? "destructive" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isStartingTracking || isStoppingTracking}
      className={`gap-2 ${className}`}
    >
      <Timer className="h-4 w-4" />
      {formattedTime}
      {isTracking ? (
        <PauseIcon className="h-3 w-3" />
      ) : (
        <PlayIcon className="h-3 w-3" />
      )}
    </Button>
  );
} 