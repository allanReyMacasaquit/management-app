import { getWorkspaceInfo } from '@/appwrite/workspaces/actions';
import JoinWorkspaceForm from '@/appwrite/workspaces/components/join-workspace-form.';
import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

interface WorkspaceIdJoinPageProps {
	params: {
		workspaceId: string;
		code: string;
	};
}
async function WorkspaceIdJoinPage({ params }: WorkspaceIdJoinPageProps) {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');

	const initialValues = await getWorkspaceInfo({
		workspaceId: params.workspaceId,
	});
	if (!initialValues) {
		redirect('/');
	}

	return (
		<div className='w-full lg:max-w-xl mx-auto'>
			<JoinWorkspaceForm initialValues={initialValues.name} />
		</div>
	);
}
export default WorkspaceIdJoinPage;
