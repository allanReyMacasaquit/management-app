// import CreateWorkspaceForm from '@/appwrite/workspaces/components/create-workspace';
import { getWorkspaces } from '@/appwrite/workspaces/actions';
import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

async function HomePage() {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');

	const workspaces = await getWorkspaces();

	if (workspaces?.total === 0) {
		redirect('/workspaces/create');
	} else {
		redirect(`/workspaces/${workspaces?.documents[0].$id}`);
	}
}
export default HomePage;
