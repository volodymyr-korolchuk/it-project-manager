import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Pause } from "lucide-react";

import { formatTime } from "@/lib/format-time";
import { useActiveWorkspace } from "@/hooks/use-active-workspace";
import { useGetActiveTask } from "../api/use-get-active-task";

import { Button } from "@/components/ui/button";
import { useTaskTimeTracking } from "../api/use-task-time-tracking";

export function TimeTrackingIndicator() {
  const router = useRouter();
  const { workspaceId } = useActiveWorkspace();
  const { data: activeTask, isLoading } = useGetActiveTask({ workspaceId });
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const { stopTracking } = useTaskTimeTracking(activeTask?.$id);
  
  // Update elapsed time every second
  useEffect(() => {
    if (!activeTask?.isTracking) return;
    
    // Calculate initial elapsed time
    const lastTrackingStart = new Date(activeTask.lastTrackingStart);
    const initialElapsed = Math.floor((Date.now() - lastTrackingStart.getTime()) / 1000);
    setElapsedTime(initialElapsed);
    
    // Set up interval to update elapsed time
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeTask?.isTracking, activeTask?.lastTrackingStart]);
  
  const totalTime = (activeTask?.timeTracked || 0) + elapsedTime;
  
  if (isLoading || !activeTask?.isTracking) {
    return null;
  }
  
  const handleTaskClick = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${activeTask.$id}`);
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-primary"
        onClick={handleTaskClick}
      >
        <Clock className="h-4 w-4 animate-pulse text-primary" />
        <span className="font-mono">{formatTime(totalTime)}</span>
        <span className="max-w-[100px] truncate hidden sm:inline-block">
          {activeTask.name}
        </span>
      </Button>
      <Button 
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => stopTracking()}
      >
        <Pause className="h-4 w-4" />
      </Button>
    </div>
  );
} 