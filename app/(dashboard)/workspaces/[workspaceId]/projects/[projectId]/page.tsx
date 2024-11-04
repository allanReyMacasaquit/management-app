import { getProject } from '@/appwrite/projects/actions';
import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

interface ProjectIdPage {
	params: {
		projectId: string;
	};
}
async function ProjectIdPage({ params }: ProjectIdPage) {
	const initialValues = await getProject({
		projectId: params.projectId,
	});
	const user = await getCurrent();
	if (!user) redirect('/sign-in');
	return <div>Project Id Page: {JSON.stringify(initialValues)}</div>;
}
export default ProjectIdPage;
