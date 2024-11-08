import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { TaskStatus } from '../types';

export const useFilterTasks = () => {
	return useQueryStates({
		projectId: parseAsString,
		status: parseAsStringEnum(Object.values(TaskStatus)),
		assigneeId: parseAsString,
		search: parseAsString,
		dueDate: parseAsString,
	});
};
export default useFilterTasks;
