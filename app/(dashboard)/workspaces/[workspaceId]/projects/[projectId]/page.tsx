import { getProject } from '@/appwrite/projects/actions';
import ProjectAvatar from '@/appwrite/projects/components/project-avatar';
import TaskViewSwitcher from '@/appwrite/tasks/components/task-view-switcher';
import { Button } from '@/components/ui/button';
import { getCurrent } from '@/features/actions';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface ProjectIdPage {
	params: {
		projectId: string;
	};
}
async function ProjectIdPage({ params }: ProjectIdPage) {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');

	const initialValues = await getProject({
		projectId: params.projectId,
	});

	if (!initialValues) throw new Error('Project not Found');

	const href = `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`;
	return (
		<div className=' flex flex-col gap-y-4'>
			<div className='flex items-center justify-between px-2 lg:p-0'>
				<div className='flex items-center gap-x-2'>
					<ProjectAvatar
						name={initialValues?.name}
						image={initialValues.imageUrl}
						className='size-10'
					/>
					<p className='capitalize tracking-widest'>{initialValues.name}</p>
				</div>
				<Link href={href}>
					<Button variant='outline' size='sm' className='w-fit'>
						<PencilIcon className='mr-2' />
						Edit Project
					</Button>
				</Link>
			</div>
			<TaskViewSwitcher />
		</div>
	);
}
export default ProjectIdPage;
