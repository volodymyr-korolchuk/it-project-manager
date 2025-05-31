import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.chat.room["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.chat.room["$post"]>;

export const useCreateChatRoom = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.chat.room["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to create chat room");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Chat room created");
      queryClient.invalidateQueries({ queryKey: ["chat-room", data.projectId] });
    },
    onError: () => {
      toast.error("Failed to create chat room");
    }
  });

  return mutation;
}; 