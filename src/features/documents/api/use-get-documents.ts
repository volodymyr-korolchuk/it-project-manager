import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetDocumentsProps {
  projectId?: string;
  workspaceId?: string;
  search?: string;
}

export const useGetDocuments = ({
  projectId,
  workspaceId,
  search,
}: UseGetDocumentsProps) => {
  const query = useQuery({
    queryKey: ["documents", projectId, workspaceId, search],
    queryFn: async () => {
      const response = await client.api.documents.$get({
        query: {
          projectId,
          workspaceId,
          search,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
}; 