import { DATABASE_ID, PROJECTS_ID } from '@/appwrite/config';
import { getMember } from '@/appwrite/members/utils';
import { sessionMiddleware } from '@/middleware/session';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import { z } from 'zod';

const app = new Hono();

app.get(
	'/',
	sessionMiddleware,
	zValidator(
		'query',
		z.object({
			workspaceId: z.string(),
		})
	),
	async (c) => {
		const user = c.get('user');
		const databases = c.get('databases');

		const { workspaceId } = c.req.valid('query');

		const member = await getMember({
			databases,
			workspaceId,
			userId: user.$id,
		});
		if (!member) return c.json({ error: 'Unathorized' }, 401);

		const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
			Query.equal('workspaceId', workspaceId),
			Query.orderDesc('$createdAt'),
		]);

		return c.json({ data: projects });
	}
);

export default app;
