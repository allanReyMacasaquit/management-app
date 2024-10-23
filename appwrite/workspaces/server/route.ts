import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { workspacesSchema } from '../schemas';
import { sessionMiddleware } from '@/middleware/session';
import {
	DATABASE_ID,
	STORAGE_BUCKET_ID,
	WORKSPACES_ID,
} from '@/appwrite/config';
import { ID } from 'node-appwrite';

const app = new Hono().post(
	'/',
	zValidator('form', workspacesSchema),
	sessionMiddleware,
	async (c) => {
		const databases = c.get('databases');
		const user = c.get('user');
		const storage = c.get('storage');

		const { name, image } = c.req.valid('form');

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

		const workspace = await databases.createDocument(
			DATABASE_ID,
			WORKSPACES_ID,
			ID.unique(),
			{
				name,
				userId: user.$id,
				imageUrl: uploadedImageUrl,
			}
		);
		return c.json({ data: workspace });
	}
);
export default app;
