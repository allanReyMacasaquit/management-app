import { client } from '@/lib/hono-client';
import { useQuery } from '@tanstack/react-query';

interface useGetMembersProps {
	workspaceId: string;
}
export const useGetMembers = ({ workspaceId }: useGetMembersProps) => {
	const query = useQuery({
		queryKey: ['members', workspaceId],
		queryFn: async () => {
			const response = await client.api.members.$get({
				query: { workspaceId },
			});

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					`Failed to fetch members: ${JSON.stringify(errorResponse)}`
				);
			}

			const { data } = await response.json();
			return data;
		},
	});

	return query;
};
