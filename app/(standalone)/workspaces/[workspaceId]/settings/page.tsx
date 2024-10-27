import { getWorkspace } from '@/appwrite/workspaces/actions';
import EditWorkspaceForm from '@/appwrite/workspaces/components/update-workspace-form';
import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

interface WorkspaceIdSettingsPageProps {
	params: {
		workspaceId: string;
	};
}

async function WorkspaceIdSettingsPage({
	params,
}: WorkspaceIdSettingsPageProps) {
	const user = getCurrent();

	if (!user) {
		redirect('/sign-in');
	}
	const initialValues = await getWorkspace({ workspaceId: params.workspaceId });

	if (!initialValues) {
		redirect(`/workspaces/${params.workspaceId}`);
	}
	return (
		<div className='w-full lg:max-w-2xl'>
			<EditWorkspaceForm initialValues={initialValues} />
		</div>
	);
}
export default WorkspaceIdSettingsPage;
