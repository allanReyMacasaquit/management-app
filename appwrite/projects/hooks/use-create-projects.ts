'use client';
import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = Exclude<
	InferResponseType<(typeof client.api)['projects']['$post']>,
	{ error: string }
>;

type RequestType = InferRequestType<typeof client.api.projects.$post>;

export const useCreateProjects = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ form }) => {
			const response = await client.api.projects.$post({ form });

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					`Failed to create project: ${JSON.stringify(errorResponse)}`
				);
			}

			return (await response.json()) as ResponseType;
		},
		onSuccess: () => {
			toast.success('Project created successfully');
			queryClient.invalidateQueries({
				queryKey: ['projects'],
			});
		},
		onError: (error) => {
			toast.error(`Failed to create project: ${error.message}`);
		},
	});

	return mutation;
};
