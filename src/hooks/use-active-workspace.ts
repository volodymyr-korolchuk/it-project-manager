import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export function useActiveWorkspace() {
  const workspaceId = useWorkspaceId();
  
  return {
    workspaceId
  };
} 