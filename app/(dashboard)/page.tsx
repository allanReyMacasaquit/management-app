import CreateWorkspaceForm from '@/appwrite/workspaces/components/create-workspace';
import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

async function HomePage() {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');

	return (
		<div>
			<CreateWorkspaceForm />
		</div>
	);
}
export default HomePage;
