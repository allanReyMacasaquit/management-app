import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { toast } from 'sonner';

type ResponseType = InferResponseType<
	(typeof client.api.tasks)[':taskId']['$delete'],
	200
>;

type RequestType = InferRequestType<
	(typeof client.api.tasks)[':taskId']['$delete']
>;
export const useDeleteTasks = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param }) => {
			const response = await client.api.tasks[':taskId']['$delete']({
				param,
			});

			// Check if the response is not OK and throw an error
			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(`Failed to delete task: ${errorResponse}`);
			}

			// Return the response JSON
			return await response.json(); // Return as ResponseType
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ['tasks'],
			});
			queryClient.invalidateQueries({
				queryKey: ['task', data.data.$id],
			});
			toast.success('Task deleted successfully');
		},
		onError: () => {
			toast.error('Failed to delete task');
		},
	});

	return mutation;
};
