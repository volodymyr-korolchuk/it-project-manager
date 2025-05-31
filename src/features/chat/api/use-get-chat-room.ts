import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetChatRoomProps {
  projectId: string;
}

export const useGetChatRoom = ({ projectId }: UseGetChatRoomProps) => {
  const query = useQuery({
    queryKey: ["chat-room", projectId],
    queryFn: async () => {
      const response = await client.api.chat.room[":projectId"].$get({
        param: { projectId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat room");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
}; 