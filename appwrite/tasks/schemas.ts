import { z } from 'zod';
import { TaskStatus } from './types';

export const createTasksSchema = z.object({
	name: z.string().trim().min(1, 'Required'),
	description: z.string().optional(),
	status: z.nativeEnum(TaskStatus, { required_error: 'Required' }),
	workspaceId: z.string().trim().min(1, 'Required'),
	projectId: z.string().trim().min(1, 'Required'),
	assigneeId: z.string().trim().min(1, 'Required'),
	dueDate: z.coerce.date(),
});

export const getTasksSchema = z.object({
	name: z.string().trim().min(1, 'Required'),
	description: z.string().optional(),
	status: z.nativeEnum(TaskStatus).nullish(),
	workspaceId: z.string(),
	projectId: z.string().nullish(),
	assigneeId: z.string().nullish(),
	dueDate: z.string().nullish(),
	search: z.string().nullish(),
});
