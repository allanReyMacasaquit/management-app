import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { workspacesSchema } from '../schemas';
import { sessionMiddleware } from '@/middleware/session';
import {
	DATABASE_ID,
	MEMBERS_ID,
	STORAGE_BUCKET_ID,
	WORKSPACES_ID,
} from '@/appwrite/config';
import { ID, Query } from 'node-appwrite';
import { Role } from '@/appwrite/members/types';

const app = new Hono()
	.get('/', sessionMiddleware, async (c) => {
		const user = c.get('user');
		const databases = c.get('databases');

		const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
			Query.equal('userId', user.$id),
		]);

		if (members.total === 0) {
			return c.json({ data: { documents: [], total: 0 } });
		}
		const workspaceIds = members.documents.map((member) => member.workspaceId);

		const workspaces = await databases.listDocuments(
			DATABASE_ID,
			WORKSPACES_ID,
			[Query.orderDesc('$createdAt'), Query.contains('$id', workspaceIds)]
		);

		return c.json({ data: workspaces });
	})
	.post(
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

			await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
				userId: user.$id,
				workspaceId: workspace.$id,
				role: Role.admin,
			});
			return c.json({ data: workspace });
		}
	);
export default app;
