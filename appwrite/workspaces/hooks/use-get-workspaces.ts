import { client } from '@/lib/hono-client';
import { useQuery } from '@tanstack/react-query';

// Custom hook to fetch workspaces
export const useGetWorkspaces = () => {
	const query = useQuery({
		queryKey: ['workspaces'],
		queryFn: async () => {
			const response = await client.api.workspaces.$get();

			// Error handling for non-OK responses
			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					`Failed to fetch workspaces: ${JSON.stringify(errorResponse)}`
				);
			}

			// Extract and return data
			const { data } = await response.json();
			return data;
		},
	});

	return query;
};
