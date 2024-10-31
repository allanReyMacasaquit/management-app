import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
	createWorkspacesSchema,
	joinWorkspacesSchema,
	updateWorkspacesSchema,
} from '../schemas';
import { sessionMiddleware } from '@/middleware/session';
import {
	DATABASE_ID,
	MEMBERS_ID,
	STORAGE_BUCKET_ID,
	WORKSPACES_ID,
} from '@/appwrite/config';
import { ID, Query } from 'node-appwrite';
import { Role } from '@/appwrite/members/types';
import { generateInviteCode } from '@/lib/utils';
import { getMember } from '@/appwrite/members/utils';
import { Workspace } from '../types';

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
		zValidator('form', createWorkspacesSchema),
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
					inviteCode: generateInviteCode(6),
				}
			);

			await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
				userId: user.$id,
				workspaceId: workspace.$id,
				role: Role.admin,
			});
			return c.json({ data: workspace });
		}
	)
	.patch(
		'/:workspaceId',
		sessionMiddleware,
		zValidator('form', updateWorkspacesSchema),
		async (c) => {
			const databases = c.get('databases');
			const storage = c.get('storage');
			const user = c.get('user');

			const { workspaceId } = c.req.param();
			const { name, image } = c.req.valid('form');

			// Ensure the user is an admin of the workspace
			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});
			if (!member || member.role !== Role.admin) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			let uploadedImageUrl: string | undefined;

			// Only handle image upload if a new image is provided
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

			// Update the workspace document, including the new image URL if provided
			const workspace = await databases.updateDocument(
				DATABASE_ID,
				WORKSPACES_ID,
				workspaceId,
				{
					name,
					...(uploadedImageUrl ? { imageUrl: uploadedImageUrl } : {}),
				}
			);

			return c.json({ data: workspace });
		}
	)
	.delete('/:workspaceId', sessionMiddleware, async (c) => {
		const databases = c.get('databases');
		const user = c.get('user');
		const { workspaceId } = c.req.param();

		// Ensure the member is an admin of the workspace
		const member = await getMember({
			databases,
			workspaceId,
			userId: user.$id,
		});
		if (!member || member.role !== Role.admin) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		// Todo Delete members, task the workspace document
		await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

		return c.json({ data: { $id: workspaceId } });
	})
	.post('/:workspaceId/reset-invite-code', sessionMiddleware, async (c) => {
		const databases = c.get('databases');
		const user = c.get('user');
		const { workspaceId } = c.req.param();

		// Ensure the member is an admin of the workspace
		const member = await getMember({
			databases,
			workspaceId,
			userId: user.$id,
		});
		if (!member || member.role !== Role.admin) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		// Generate a new invite code
		const newInviteCode = generateInviteCode(6);

		// Update the workspace document with the new invite code
		const updatedData = await databases.updateDocument(
			DATABASE_ID,
			WORKSPACES_ID,
			workspaceId,
			{ inviteCode: newInviteCode } // Make sure to send the new invite code here
		);

		return c.json({ data: updatedData });
	})
	.post(
		'/:workspaceId/join',
		sessionMiddleware,
		zValidator('json', joinWorkspacesSchema),
		async (c) => {
			const databases = c.get('databases');
			const user = c.get('user');

			const { workspaceId } = c.req.param();
			const { code } = c.req.valid('json');

			const member = await getMember({
				databases,
				workspaceId,
				userId: user.$id,
			});

			if (member) {
				return c.json({ error: 'Already a member' }, 400);
			}

			const workspace = await databases.getDocument<Workspace>(
				DATABASE_ID,
				WORKSPACES_ID,
				workspaceId
			);

			if (workspace.inviteCode !== code) {
				return c.json({ error: 'Invalid invite code' }, 400);
			}

			await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
				workspaceId,
				userId: user.$id,
				role: Role.members,
			});

			return c.json({ data: workspace });
		}
	);

export default app;
