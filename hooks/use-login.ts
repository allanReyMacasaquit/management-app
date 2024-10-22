import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.auth.login.$post>;
type RequestType = InferRequestType<typeof client.api.auth.login.$post>;

export const useLogin = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ json }) => {
			const response = await client.api.auth.login.$post({ json });
			return await response.json();
		},
		onSuccess: () => {
			toast.success('You have logged in successfully');
			router.refresh();
			queryClient.invalidateQueries({ queryKey: ['current'] });
		},
		onError: () => {
			toast.error('Failed to login, Please try again');
		},
	});
	return mutation;
};
