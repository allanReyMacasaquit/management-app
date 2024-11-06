import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

// Define the expected response type for the delete operation
type ResponseType = InferResponseType<
	(typeof client.api.projects)[':projectId']['$delete'],
	200
>;

// Define the request type for the delete operation
type RequestType = InferRequestType<
	(typeof client.api.projects)[':projectId']['$delete']
>;

// Custom hook to handle deleting workspaces
export const useDeleteProjects = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param }) => {
			const response = await client.api.projects[':projectId']['$delete']({
				param,
			});

			// Check if the response is not OK and throw an error
			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(`Failed to delete project: ${errorResponse}`);
			}

			// Return the response JSON
			return await response.json(); // Return as ResponseType
		},
		onSuccess: (data) => {
			toast.success('Project deleted successfully');
			queryClient.invalidateQueries({
				queryKey: ['projects'],
			});
			queryClient.invalidateQueries({
				queryKey: ['projects', data.data.$id],
			});
		},
		onError: () => {
			toast.error('Failed to delete project');
		},
	});

	return mutation;
};
