import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Define the expected response type for the update workspace operation
type ResponseType = InferResponseType<
	(typeof client.api.projects)[':projectId']['$patch'],
	200
>;

// Define the request type for the update workspace operation
type RequestType = InferRequestType<
	(typeof client.api.projects)[':projectId']['$patch']
>;

// Custom hook to handle updating workspaces
export const useUpdateProject = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ form, param }) => {
			const response = await client.api.projects[':projectId']['$patch']({
				form,
				param,
			});

			// Error handling with descriptive feedback
			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					`Failed to update workspace: ${JSON.stringify(errorResponse)}`
				);
			}

			// Return the response as ResponseType
			return (await response.json()) as ResponseType;
		},
		onSuccess: ({ data }) => {
			router.refresh();
			toast.success('Project updated successfully');
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			queryClient.invalidateQueries({ queryKey: ['projects', data.$id] });
		},
		onError: (error) => {
			// Enhanced error message
			toast.error(`Failed to update project: ${error.message}`);
		},
	});

	return mutation;
};
