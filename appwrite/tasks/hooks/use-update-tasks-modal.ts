'use client';
import { parseAsString, useQueryState } from 'nuqs';

function useUpdateTasksModal() {
	const [taskId, setTaskId] = useQueryState('edit-task', parseAsString);
	const open = (id: string) => setTaskId(id);
	const close = () => setTaskId(null);

	return {
		taskId,
		open,
		close,
		setTaskId,
	};
}
export default useUpdateTasksModal;
