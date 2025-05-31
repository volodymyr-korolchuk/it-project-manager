import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.documents[":documentId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.documents[":documentId"]["$patch"]>;

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.documents[":documentId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ 
        queryKey: ["document", data.data.$id] 
      });
    },
    onError: (error) => {
      console.error("Failed to update document:", error);
    },
  });

  return mutation;
}; 