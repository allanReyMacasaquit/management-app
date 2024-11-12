import { client } from '@/lib/hono-client';
import { useQuery } from '@tanstack/react-query';

interface useGetTaskProps {
	taskId: string;
}
export const useGetTask = ({ taskId }: useGetTaskProps) => {
	const query = useQuery({
		queryKey: ['tasks', taskId],
		queryFn: async () => {
			const response = await client.api.tasks[':taskId'].$get({
				param: { taskId },
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
