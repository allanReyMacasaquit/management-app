import { DATABASE_ID, PROJECTS_ID, STORAGE_BUCKET_ID } from '@/appwrite/config';
import { getMember } from '@/appwrite/members/utils';
import { sessionMiddleware } from '@/middleware/session';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';
import { createProjectSchema } from '../schemas';

const app = new Hono()
	.post(
		'/',
		zValidator('form', createProjectSchema),
		sessionMiddleware,
		async (c) => {
			const databases = c.get('databases');
			const user = c.get('user');
			const storage = c.get('storage');

			const { name, image, workspaceId } = c.req.valid('form');

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

			if (!member) return c.json({ error: 'Unathorized' });

			let uploadedImageUrl: string | undefined;

			if (image instanceof File) {
				const file = await storage.createFile(
					STORAGE_BUCKET_ID,
					ID.unique(),
					image
				);

				const arrayBuffer = await storage.getFilePreview(
					STORAGE_BUCKET_ID,
					file.$id
				);

				uploadedImageUrl = `data:image/png;base64,${Buffer.from(
					arrayBuffer
				).toString('base64')}`;
			}

			const project = await databases.createDocument(
				DATABASE_ID,
				PROJECTS_ID,
				ID.unique(),
				{
					name,
					imageUrl: uploadedImageUrl,
					workspaceId,
				}
			);

			return c.json({ data: project });
		}
	)
	.get(
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

			if (!workspaceId) return c.json({ error: 'Unauthorized' }, 400);

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
