import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Define the expected response type for the delete operation
type ResponseType = InferResponseType<
	(typeof client.api.workspaces)[':workspaceId']['join']['$post'],
	200
>;

// Define the request type for the delete operation
type RequestType = InferRequestType<
	(typeof client.api.workspaces)[':workspaceId']['join']['$post']
>;

// Custom hook to handle deleting workspaces
export const useJoinWorkspace = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param, json }) => {
			const response = await client.api.workspaces[':workspaceId']['join'][
				'$post'
			]({
				param,
				json,
			});

			if (!response.ok) {
				await response.json();
				throw new Error(`Failed to join workspace`);
			}

			return await response.json();
		},
		onSuccess: (data) => {
			toast.success('Joined workspace successfully');
			router.refresh();
			queryClient.invalidateQueries({
				queryKey: ['workspaces'],
			});
			queryClient.invalidateQueries({
				queryKey: ['workspace', data.data.$id],
			});
		},
		onError: () => {
			toast.error('Failed to join workspace');
		},
	});

	return mutation;
};
