import { toast } from "sonner";
import { useState, useEffect } from "react";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { useActiveWorkspace } from "@/hooks/use-active-workspace";

type StartResponseType = InferResponseType<typeof client["api"]["time-tracking"][":taskId"]["start"]["$post"], 200>;
type StopResponseType = InferResponseType<typeof client["api"]["time-tracking"][":taskId"]["stop"]["$post"], 200>;
type TimeEntriesResponseType = InferResponseType<typeof client["api"]["time-tracking"][":taskId"]["time-entries"]["$get"], 200>;

export function useTaskTimeTracking(taskId?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { workspaceId } = useActiveWorkspace();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Get task time entries
  const { 
    data: timeEntriesData,
    isLoading: isLoadingTimeEntries,
    error: timeEntriesError,
    refetch: refetchTimeEntries
  } = useQuery({
    queryKey: ["time-entries", taskId],
    queryFn: async () => {
      if (!taskId) return null;
      const response = await client.api["time-tracking"][":taskId"]["time-entries"].$get({
        param: { taskId }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch time entries");
      }

      const { data } = await response.json();
      return data;
    },
    enabled: !!taskId
  });

  // Start time tracking mutation
  const { 
    mutate: startTracking,
    isPending: isStartingTracking 
  } = useMutation({
    mutationFn: async () => {
      if (!taskId) throw new Error("Task ID is required");
      const response = await client.api["time-tracking"][":taskId"]["start"].$post({
        param: { taskId }
      });

      if (!response.ok) {
        throw new Error("Failed to start time tracking");
      }

      const { data } = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast.success("Time tracking started");
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      
      // Start timer
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      setIntervalId(interval);
    },
    onError: (error) => {
      console.error("Failed to start time tracking:", error);
      toast.error("Failed to start time tracking");
    }
  });

  // Stop time tracking mutation
  const { 
    mutate: stopTracking,
    isPending: isStoppingTracking 
  } = useMutation({
    mutationFn: async () => {
      if (!taskId) throw new Error("Task ID is required");
      const response = await client.api["time-tracking"][":taskId"]["stop"].$post({
        param: { taskId }
      });

      if (!response.ok) {
        throw new Error("Failed to stop time tracking");
      }

      const { data } = await response.json();
      return data;
    },
    onSuccess: (data) => {
      toast.success("Time tracking stopped");
      refetchTimeEntries();
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      
      // Clear interval
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setElapsedTime(0);
    },
    onError: (error) => {
      console.error("Failed to stop time tracking:", error);
      toast.error("Failed to stop time tracking");
    }
  });

  // Add manual time entry mutation
  const {
    mutate: addTimeEntry,
    isPending: isAddingTimeEntry
  } = useMutation({
    mutationFn: async (data: { startTime: string; endTime: string; description?: string }) => {
      if (!taskId) throw new Error("Task ID is required");
      const response = await client.api["time-tracking"][":taskId"]["time-entries"].$post({
        param: { taskId },
        json: data
      });

      if (!response.ok) {
        throw new Error("Failed to add time entry");
      }

      const responseData = await response.json();
      return responseData.data;
    },
    onSuccess: () => {
      toast.success("Time entry added");
      refetchTimeEntries();
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
    onError: (error) => {
      console.error("Failed to add time entry:", error);
      toast.error("Failed to add time entry");
    }
  });

  // Delete time entry mutation
  const {
    mutate: deleteTimeEntry,
    isPending: isDeletingTimeEntry
  } = useMutation({
    mutationFn: async (entryId: string) => {
      const response = await client.api["time-tracking"]["time-entries"][":entryId"].$delete({
        param: { entryId }
      });

      if (!response.ok) {
        throw new Error("Failed to delete time entry");
      }

      const { data } = await response.json();
      return data;
    },
    onSuccess: () => {
      toast.success("Time entry deleted");
      refetchTimeEntries();
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
    onError: (error) => {
      console.error("Failed to delete time entry:", error);
      toast.error("Failed to delete time entry");
    }
  });

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return {
    // Data
    timeEntries: timeEntriesData?.documents || [],
    totalTimeTracked: timeEntriesData?.documents?.reduce(
      (total: number, entry: any) => total + (entry.duration || 0),
      0
    ) || 0,
    elapsedTime,
    
    // Status
    isLoadingTimeEntries,
    isStartingTracking,
    isStoppingTracking,
    isAddingTimeEntry,
    isDeletingTimeEntry,
    
    // Errors
    timeEntriesError,
    
    // Methods
    startTracking,
    stopTracking,
    addTimeEntry,
    deleteTimeEntry,
    refetchTimeEntries,
  };
} 