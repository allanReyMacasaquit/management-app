import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

interface ProjectIdPage {
	params: {
		projectId: string;
	};
}
async function ProjectIdPage({ params }: ProjectIdPage) {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');
	return <div>Project Id Page: {params.projectId}</div>;
}
export default ProjectIdPage;
