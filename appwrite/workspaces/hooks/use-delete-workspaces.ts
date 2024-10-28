import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

// Define the expected response type for the delete operation
type ResponseType = InferResponseType<
	(typeof client.api.workspaces)[':workspaceId']['$delete'],
	200
>;

// Define the request type for the delete operation
type RequestType = InferRequestType<
	(typeof client.api.workspaces)[':workspaceId']['$delete']
>;

// Custom hook to handle deleting workspaces
export const useDeleteWorkspaces = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param }) => {
			const response = await client.api.workspaces[':workspaceId']['$delete']({
				param,
			});

			// Check if the response is not OK and throw an error
			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(`Failed to delete workspace: ${errorResponse}`);
			}

			// Return the response JSON
			return await response.json(); // Return as ResponseType
		},
		onSuccess: (data) => {
			toast.success('Workspace deleted successfully');
			// Invalidate queries to refresh the workspace list and details
			queryClient.invalidateQueries({
				queryKey: ['workspaces'],
			});
			queryClient.invalidateQueries({
				queryKey: ['workspace', data.data.$id],
			});
		},
		onError: () => {
			toast.error('Failed to delete workspace');
		},
	});

	return mutation;
};
