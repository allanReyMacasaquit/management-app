import { AUTH_COOKIE } from '@/app/server/constant';
import { cookies } from 'next/headers';
import { Client, Account, Databases, Query } from 'node-appwrite';
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '../config';
import { getMember } from '../members/utils';
import { Workspace } from './types';

// Initialize and authenticate Appwrite client
export const initializeClient = () => {
	const client = new Client()
		.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
		.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

	const session = cookies().get(AUTH_COOKIE);
	if (session) {
		client.setSession(session.value);
	}
	return { client, session };
};

// Fetch current user details
export const getUser = async (client: Client) => {
	const account = new Account(client);
	return await account.get();
};

// Fetch workspaces associated with a user's membership
export const getWorkspaces = async () => {
	const { client, session } = initializeClient();
	if (!session) return { documents: [], total: 0 };

	const databases = new Databases(client);
	const user = await getUser(client);

	try {
		const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
			Query.equal('userId', user.$id),
		]);

		if (members.total === 0) return { documents: [], total: 0 };

		const workspaceIds = members.documents.map((member) => member.workspaceId);

		return await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
			Query.orderDesc('$createdAt'),
			Query.contains('$id', workspaceIds),
		]);
	} catch {
		return { documents: [], total: 0 };
	}
};

interface GetWorkspaceProps {
	workspaceId: string;
}

// Fetch a specific workspace if user has membership access
export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
	const { client, session } = initializeClient();
	if (!session) return null;

	const databases = new Databases(client);
	const user = await getUser(client);

	const member = await getMember({
		databases,
		userId: user.$id,
		workspaceId,
	});
	if (!member) return null;

	try {
		return await databases.getDocument<Workspace>(
			DATABASE_ID,
			WORKSPACES_ID,
			workspaceId
		);
	} catch {
		return null;
	}
};

interface GetWorkspaceInfoProps {
	workspaceId: string;
}

// Fetch minimal workspace info (name) for display purposes
export const getWorkspaceInfo = async ({
	workspaceId,
}: GetWorkspaceInfoProps) => {
	const { client, session } = initializeClient();
	if (!session) return null;

	const databases = new Databases(client);

	try {
		const workspace = await databases.getDocument<Workspace>(
			DATABASE_ID,
			WORKSPACES_ID,
			workspaceId
		);

		return { name: workspace.name };
	} catch {
		return null;
	}
};
