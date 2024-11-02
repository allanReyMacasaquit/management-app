import { client } from '@/lib/hono-client';
import { useQuery } from '@tanstack/react-query';

interface useGetProjectsProps {
	workspaceId: string;
}
export const useGetProjects = ({ workspaceId }: useGetProjectsProps) => {
	const query = useQuery({
		queryKey: ['projects', workspaceId],
		queryFn: async () => {
			const response = await client.api.projects.$get({
				query: { workspaceId },
			});

			if (!response.ok) {
				const errorResponse = await response.json();
				throw new Error(
					`Failed to fetch projects: ${JSON.stringify(errorResponse)}`
				);
			}

			const { data } = await response.json();

			return data;
		},
	});

	return query;
};
