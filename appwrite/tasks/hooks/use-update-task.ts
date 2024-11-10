'use client';
import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = Exclude<
	InferResponseType<(typeof client.api)['tasks'][':taskId']['$patch']>,
	{ error: string }
>;

type RequestType = InferRequestType<
	(typeof client.api)['tasks'][':taskId']['$patch']
>;

export const useUpdateTask = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ json, param }) => {
			const response = await client.api['tasks'][':taskId']['$patch']({
				json,
				param,
			});

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					`Failed to create task: ${JSON.stringify(errorResponse)}`
				);
			}

			return (await response.json()) as ResponseType;
		},
		onSuccess: ({ data }) => {
			router.refresh();
			toast.success('Task updated successfully');
			queryClient.invalidateQueries({
				queryKey: ['tasks'],
			});
			queryClient.invalidateQueries({
				queryKey: ['task', data.$id],
			});
		},
		onError: (error) => {
			toast.error(`Failed to update task: ${error.message}`);
		},
	});

	return mutation;
};
