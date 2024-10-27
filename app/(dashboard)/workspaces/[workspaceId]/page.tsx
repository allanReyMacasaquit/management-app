import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

async function WorkspaceIdPage() {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');
	return <div>Workspaceage</div>;
}
export default WorkspaceIdPage;
