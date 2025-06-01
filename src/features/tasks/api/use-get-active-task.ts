import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { Task } from "../types";

interface UseGetActiveTaskProps {
  workspaceId: string;
}

export function useGetActiveTask({ workspaceId }: UseGetActiveTaskProps) {
  return useQuery({
    queryKey: ["active-task", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          isTracking: "true"
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch active task");
      }
      
      const { data } = await response.json();
      
      // Find the active task in the returned documents
      const activeTask = data.documents.find((task: Task) => task.isTracking === true);
      
      return activeTask || null;
    },
    // Refresh every 10 seconds to detect changes
    refetchInterval: 10000,
    enabled: !!workspaceId,
  });
} 