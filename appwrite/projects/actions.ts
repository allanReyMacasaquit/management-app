import { Databases } from 'node-appwrite';
import { getUser, initializeClient } from '../workspaces/actions';
import { getMember } from '../members/utils';
import { DATABASE_ID, PROJECTS_ID } from '../config';
import { Project } from './types';

interface GetProjectProps {
	projectId: string;
}

export const getProject = async ({ projectId }: GetProjectProps) => {
	try {
		const { client, session } = initializeClient();
		if (!session) return null;

		const databases = new Databases(client);
		const user = await getUser(client);

		const project = await databases.getDocument<Project>(
			DATABASE_ID,
			PROJECTS_ID,
			projectId
		);

		const member = await getMember({
			databases,
			userId: user.$id,
			workspaceId: project.workspaceId,
		});
		if (!member) return null;

		return project;
	} catch (error) {
		console.error('Error fetching project:', error);
		// Optionally, you can return null or throw an error here based on your use case
		return null; // or throw new Error('Could not fetch project');
	}
};
