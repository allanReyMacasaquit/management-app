import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Define the expected response type for the delete operation
type ResponseType = InferResponseType<
	(typeof client.api.workspaces)[':workspaceId']['reset-invite-code']['$post'],
	200
>;

// Define the request type for the delete operation
type RequestType = InferRequestType<
	(typeof client.api.workspaces)[':workspaceId']['reset-invite-code']['$post']
>;

// Custom hook to handle deleting workspaces
export const useResetInviteCode = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param }) => {
			const response = await client.api.workspaces[':workspaceId'][
				'reset-invite-code'
			]['$post']({
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
			toast.success('Reset invite code successfully');
			router.refresh();
			queryClient.invalidateQueries({
				queryKey: ['workspaces'],
			});
			queryClient.invalidateQueries({
				queryKey: ['workspace', data.data.$id],
			});
		},
		onError: () => {
			toast.error('Failed to reset invite code');
		},
	});

	return mutation;
};
