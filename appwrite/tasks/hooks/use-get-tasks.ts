import { client } from '@/lib/hono-client';
import { useQuery } from '@tanstack/react-query';
import { TaskStatus } from '../types';

interface useGetTasksProps {
	workspaceId: string;
	projectId?: string | null;
	status?: TaskStatus | null;
	assigneeId?: string | null;
	dueDate?: string | null;
	search?: string | null;
}
export const useGetTasks = ({
	workspaceId,
	assigneeId,
	dueDate,
	projectId,
	status,
	search,
}: useGetTasksProps) => {
	const query = useQuery({
		queryKey: [
			'tasks',
			workspaceId,
			projectId,
			status,
			search,
			assigneeId,
			dueDate,
		],
		queryFn: async () => {
			const response = await client.api.tasks.$get({
				query: {
					workspaceId,
					projectId: projectId ?? undefined,
					status: status ?? undefined,
					assigneeId: assigneeId ?? undefined,
					search: search ?? undefined,
					dueDate: dueDate ?? undefined,
				},
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
