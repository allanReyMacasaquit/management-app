import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { workspacesSchema } from '../schemas';
import { sessionMiddleware } from '@/middleware/session';
import { DATABASE_ID, WORKSPACES_ID } from '@/appwrite/config';
import { ID } from 'node-appwrite';

const app = new Hono().post(
	'/',
	zValidator('json', workspacesSchema),
	sessionMiddleware,
	async (c) => {
		const databases = c.get('databases');
		const user = c.get('user');

		const { name } = c.req.valid('json');

		const workspace = await databases.createDocument(
			DATABASE_ID,
			WORKSPACES_ID,
			ID.unique(),
			{
				name,
				userId: user.$id,
			}
		);
		return c.json({ data: workspace });
	}
);
export default app;
