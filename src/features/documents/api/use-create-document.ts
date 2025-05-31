import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.documents["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.documents["$post"]>;

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.documents["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Document created");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      router.push(`/workspaces/${data.workspaceId}/projects/${data.projectId}/documents/${data.$id}`);
    },
    onError: () => {
      toast.error("Failed to create document");
    },
  });

  return mutation;
}; 