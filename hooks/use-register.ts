import { client } from '@/lib/hono-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.auth.register.$post>;
type RequestType = InferRequestType<typeof client.api.auth.register.$post>;

export const useRegister = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ json }) => {
			const response = await client.api.auth.register.$post({ json });
			return await response.json();
		},
		onSuccess: () => {
			toast.success('Your account has been created successfully.');
			router.refresh();
			queryClient.invalidateQueries({ queryKey: ['current'] });
		},
		onError: () => {
			toast.error('Failed to register, Please try again');
		},
	});
	return mutation;
};
