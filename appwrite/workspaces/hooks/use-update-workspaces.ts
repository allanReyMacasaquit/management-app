import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

// Define the expected response type for the update workspace operation
type ResponseType = InferResponseType<
	(typeof client.api.workspaces)[':workspaceId']['$patch'],
	200
>;

// Define the request type for the update workspace operation
type RequestType = InferRequestType<
	(typeof client.api.workspaces)[':workspaceId']['$patch']
>;

// Custom hook to handle updating workspaces
export const useUpdateWorkspaces = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ form, param }) => {
			const response = await client.api.workspaces[':workspaceId']['$patch']({
				form,
				param,
			});

			// Error handling with descriptive feedback
			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					`Failed to update workspace: ${JSON.stringify(errorResponse)}`
				);
			}

			// Return the response as ResponseType
			return (await response.json()) as ResponseType;
		},
		onSuccess: (data) => {
			toast.success('Workspace updated successfully');

			// Invalidate queries to refresh the updated workspace list and details
			queryClient.invalidateQueries({ queryKey: ['workspaces'] });
			queryClient.invalidateQueries({
				queryKey: ['workspace', data.data?.$id],
			});
		},
		onError: (error) => {
			// Enhanced error message
			toast.error(`Failed to update workspace: ${error.message}`);
		},
	});

	return mutation;
};
