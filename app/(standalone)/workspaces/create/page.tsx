import CreateWorkspaceForm from '@/appwrite/workspaces/components/create-workspace-form';
import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

async function WorkSpaceCreatePage() {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');
	return (
		<div className='w-full max-w-2xl'>
			<CreateWorkspaceForm />
		</div>
	);
}
export default WorkSpaceCreatePage;
