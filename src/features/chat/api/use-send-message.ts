import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.chat.message["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.chat.message["$post"]>;

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ json }) => {
      const response = await client.api.chat.message["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", data.projectId] });
    },
    onError: () => {
      toast.error("Failed to send message");
    }
  });

  return mutation;
}; 