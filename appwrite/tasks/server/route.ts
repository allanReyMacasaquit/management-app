import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
	BulkUpdateSchema,
	createTasksSchema,
	getTasksSchema,
} from '../schemas';
import { sessionMiddleware } from '@/middleware/session';
import { getMember } from '@/appwrite/members/utils';
import {
	DATABASE_ID,
	MEMBERS_ID,
	PROJECTS_ID,
	TASKS_ID,
} from '@/appwrite/config';
import { ID, Query } from 'node-appwrite';
import { createAdminClient } from '@/appwrite/appwrite';
import { Project } from '@/appwrite/projects/types';
import { Task } from '../types';
const app = new Hono()
	.get(
		'/',
		sessionMiddleware,
		zValidator('query', getTasksSchema),
		async (c) => {
			const { users } = await createAdminClient();
			const databases = c.get('databases');
			const user = c.get('user');

			const { status, assigneeId, dueDate, projectId, workspaceId, search } =
				c.req.valid('query');

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});
			if (!member) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const query = [
				Query.equal('workspaceId', workspaceId),
				Query.orderDesc('$createdAt'),
			];
			if (projectId) {
				console.log('ProjectId: ', projectId);
				query.push(Query.equal('projectId', projectId));
			}
			if (status) {
				console.log('status: ', status);
				query.push(Query.equal('status', status));
			}
			if (assigneeId) {
				console.log('assigneeId: ', assigneeId);
				query.push(Query.equal('assigneeId', assigneeId));
			}
			if (dueDate) {
				console.log('dueDate: ', dueDate);
				query.push(Query.equal('dueDate', dueDate));
			}
			if (search) {
				console.log('search: ', search);
				query.push(Query.search('search', search));
			}
			const tasks = await databases.listDocuments<Task>(
				DATABASE_ID,
				TASKS_ID,
				query
			);

			const projectIds = tasks.documents.map((task) => task.projectId);
			const assigneeIds = tasks.documents.map((task) => task.assigneeId);

			const projects = await databases.listDocuments<Project>(
				DATABASE_ID,
				PROJECTS_ID,
				projectIds.length > 0 ? [Query.contains('$id', projectIds)] : []
			);

			const members = await databases.listDocuments(
				DATABASE_ID,
				MEMBERS_ID,
				assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : []
			);

			const assignees = await Promise.all(
				members.documents.map(async (member) => {
					const user = await users.get(member.userId);
					return {
						...member,
						name: user.name,
						email: user.email,
					};
				})
			);

			const populatedTasks = tasks.documents.map((task) => {
				const project = projects.documents.find(
					(project) => project.$id === task.projectId
				);
				const assignee = assignees.find(
					(assignee) => assignee.$id === task.assigneeId
				);

				return {
					...task,
					project,
					assignee,
				};
			});

			return c.json({ data: { ...tasks, documents: populatedTasks } });
		}
	)
	.get('/:taskId', sessionMiddleware, async (c) => {
		const databases = c.get('databases');
		const currentUser = c.get('user');
		const { users } = await createAdminClient();
		const { taskId } = c.req.param();

		const task = await databases.getDocument<Task>(
			DATABASE_ID,
			TASKS_ID,
			taskId
		);

		const currentMember = await getMember({
			databases,
			workspaceId: task.workspaceId,
			userId: currentUser.$id,
		});
		if (!currentMember) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		const project = await databases.getDocument<Project>(
			DATABASE_ID,
			PROJECTS_ID,
			task.projectId
		);

		const member = await databases.getDocument(
			DATABASE_ID,
			MEMBERS_ID,
			task.assigneeId
		);

		const user = await users.get(member.userId);

		const assignee = {
			...member,
			name: user.name,
			email: user.email,
		};

		return c.json({ data: { ...task, project, assignee } });
	})
	.post(
		'/',
		sessionMiddleware,
		zValidator('json', createTasksSchema),
		async (c) => {
			const databases = c.get('databases');
			const user = c.get('user');

			const { name, status, assigneeId, dueDate, projectId, workspaceId } =
				c.req.valid('json');

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});
			if (!member) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const highestPositionTask = await databases.listDocuments(
				DATABASE_ID,
				TASKS_ID,
				[
					Query.equal('status', status),
					Query.equal('workspaceId', workspaceId),
					Query.orderAsc('position'),
					Query.limit(1),
				]
			);

			const newPosition =
				highestPositionTask.documents.length > 0
					? highestPositionTask.documents[0].position + 1000
					: 1000;

			const task = await databases.createDocument(
				DATABASE_ID,
				TASKS_ID,
				ID.unique(),
				{
					name,
					status,
					dueDate,
					projectId,
					workspaceId,
					assigneeId,
					position: newPosition,
				}
			);
			return c.json({ data: task });
		}
	)
	.patch(
		'/:taskId',
		sessionMiddleware,
		zValidator('json', createTasksSchema.partial()),
		async (c) => {
			const databases = c.get('databases');
			const user = c.get('user');

			const { name, status, assigneeId, dueDate, projectId, description } =
				c.req.valid('json');
			const { taskId } = c.req.param();

			const existingTask = await databases.getDocument<Task>(
				DATABASE_ID,
				TASKS_ID,
				taskId
			);

			const member = await getMember({
				databases,
				workspaceId: existingTask.workspaceId,
				userId: user.$id,
			});
			if (!member) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const task = await databases.updateDocument(
				DATABASE_ID,
				TASKS_ID,
				taskId,
				{
					name,
					status,
					dueDate,
					projectId,
					description,
					assigneeId,
				}
			);
			return c.json({ data: task });
		}
	)
	.delete('/:taskId', sessionMiddleware, async (c) => {
		const databases = c.get('databases');
		const user = c.get('user');
		const { taskId } = c.req.param();

		const task = await databases.getDocument<Task>(
			DATABASE_ID,
			TASKS_ID,
			taskId
		);

		// Ensure the member is an admin of the workspace
		const member = await getMember({
			databases,
			workspaceId: task.workspaceId,
			userId: user.$id,
		});
		if (!member) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

		return c.json({ data: { $id: task.$id } });
	})
	.post(
		'/bulk-update',
		sessionMiddleware,
		zValidator('json', BulkUpdateSchema),
		async (c) => {
			const databases = c.get('databases');
			const user = c.get('user');

			const { tasks } = c.req.valid('json');

			const taskstoUpdate = await databases.listDocuments(
				DATABASE_ID,
				TASKS_ID,
				[
					Query.contains(
						'$id',
						tasks.map((task) => task.$id)
					),
				]
			);

			const workspaceIds = new Set(
				taskstoUpdate.documents.map((task) => task.workspaceId)
			);

			if (workspaceIds.size !== 1) {
				return c.json({ error: 'All tasks must belong to the same workspace' });
			}

			const workspaceId = workspaceIds.values().next().value;

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

			if (!member) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const updatedTasks = await Promise.all(
				tasks.map(async (task) => {
					const { $id, status, position } = task;
					return databases.updateDocument<Task>(DATABASE_ID, TASKS_ID, $id, {
						status,
						position,
					});
				})
			);
			return c.json({ data: updatedTasks });
		}
	);

export default app;
