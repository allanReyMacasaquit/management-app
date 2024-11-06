import { getProject } from '@/appwrite/projects/actions';
import UpdateProjectForm from '@/appwrite/projects/components/update-project-form';

import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

interface ProjectIdSettingsPageProps {
	params: {
		projectId: string;
	};
}

async function ProjectIdSettingsPage({ params }: ProjectIdSettingsPageProps) {
	const user = await getCurrent();

	if (!user) {
		redirect('/sign-in');
	}
	const initialValues = await getProject({ projectId: params.projectId });

	if (!initialValues) {
		redirect(`/workspaces/${initialValues!.workspaceId}}`);
	}
	return (
		<div className='w-full lg:max-w-2xl mt-5'>
			<UpdateProjectForm
				initialValues={initialValues}
				key={initialValues.$id}
			/>
		</div>
	);
}
export default ProjectIdSettingsPage;
