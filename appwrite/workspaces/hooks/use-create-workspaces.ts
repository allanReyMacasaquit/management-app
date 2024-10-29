'use client';
import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

// Define the expected response type for creating a workspace
type ResponseType = InferResponseType<typeof client.api.workspaces.$post>;

// Define the request type for creating a workspace
type RequestType = InferRequestType<typeof client.api.workspaces.$post>;

// Custom hook to handle workspace creation
export const useCreateWorkspaces = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ form }) => {
			const response = await client.api.workspaces.$post({ form });

			// Validate response and handle potential errors
			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					`Failed to create workspace: ${JSON.stringify(errorResponse)}`
				);
			}

			// Return the response as ResponseType
			return (await response.json()) as ResponseType;
		},
		onSuccess: () => {
			toast.success('Workspace created successfully');

			// Invalidate queries to refresh workspace list
			queryClient.invalidateQueries({ queryKey: ['workspaces'] });
		},
		onError: (error) => {
			// Provide more detailed error feedback
			toast.error(`Failed to create workspace: ${error.message}`);
		},
	});

	return mutation;
};
