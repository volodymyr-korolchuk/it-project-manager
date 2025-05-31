import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetMessagesProps {
  projectId: string;
}

export const useGetMessages = ({ projectId }: UseGetMessagesProps) => {
  const query = useQuery({
    queryKey: ["chat-messages", projectId],
    queryFn: async () => {
      const response = await client.api.chat.messages[":projectId"].$get({
        param: { projectId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const { data } = await response.json();
      return data;
    },
    refetchInterval: 3000, // Poll for new messages every 3 seconds
  });

  return query;
}; 