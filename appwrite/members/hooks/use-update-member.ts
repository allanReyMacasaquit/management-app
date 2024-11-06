import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Define the expected response type for the delete operation
type ResponseType = InferResponseType<
	(typeof client.api.members)[':memberId']['$patch'],
	200
>;

// Define the request type for the delete operation
type RequestType = InferRequestType<
	(typeof client.api.members)[':memberId']['$patch']
>;

// Custom hook to handle deleting workspaces
export const useUpdateMember = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ param, json }) => {
			const response = await client.api.members[':memberId']['$patch']({
				param,
				json,
			});

			// Check if the response is not OK and throw an error
			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(`Failed to update member: ${errorResponse}`);
			}

			// Return the response JSON
			return await response.json(); // Return as ResponseType
		},
		onSuccess: () => {
			router.refresh();
			toast.success('Member updated successfully');
			// Invalidate queries to refresh the workspace list and details
			queryClient.invalidateQueries({
				queryKey: ['members'],
			});
		},
		onError: () => {
			toast.error('Failed to update member');
		},
	});

	return mutation;
};
