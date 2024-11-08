'use client';
import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = Exclude<
	InferResponseType<(typeof client.api)['tasks']['$post']>,
	{ error: string }
>;

type RequestType = InferRequestType<(typeof client.api)['tasks']['$post']>;

export const useCreateTasks = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ json }) => {
			const response = await client.api['tasks']['$post']({ json });

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					`Failed to create task: ${JSON.stringify(errorResponse)}`
				);
			}

			return (await response.json()) as ResponseType;
		},
		onSuccess: () => {
			router.refresh();
			toast.success('Task created successfully');
			queryClient.invalidateQueries({
				queryKey: ['tasks'],
			});
		},
		onError: (error) => {
			toast.error(`Failed to create task: ${error.message}`);
		},
	});

	return mutation;
};
