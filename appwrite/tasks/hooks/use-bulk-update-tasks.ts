'use client';
import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = Exclude<
	InferResponseType<(typeof client.api)['tasks']['bulk-update']['$post']>,
	{ error: string }
>;

type RequestType = InferRequestType<
	(typeof client.api)['tasks']['bulk-update']['$post']
>;

export const useBulkUpdateTasks = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ json }) => {
			const response = await client.api['tasks']['bulk-update']['$post']({
				json,
			});

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					`Failed to create task: ${JSON.stringify(errorResponse)}`
				);
			}

			return (await response.json()) as ResponseType;
		},
		onSuccess: () => {
			toast.success(`Task Status Moved ${task.}`);
			queryClient.invalidateQueries({
				queryKey: ['tasks'],
			});
		},
		onError: (error) => {
			toast.error(`Failed to update task: ${error.message}`);
		},
	});

	return mutation;
};
