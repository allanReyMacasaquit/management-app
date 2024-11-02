'use client';

import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import { RiAddCircleFill } from 'react-icons/ri';
import { useGetProjects } from '../hooks/use-get-projects';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import useCreateProjectsModal from '../hooks/use-create-projects-modal';
import ProjectAvatar from './project-avatar';

function Projects() {
	const projectId = 123; // Todo
	const pathname = usePathname();
	const workspaceId = useWorkspaceId();
	const { data } = useGetProjects({
		workspaceId,
	});
	const { open } = useCreateProjectsModal();

	return (
		<div className='flex flex-col'>
			<div className='flex items-center justify-between p-4 border rounded-xl mt-4'>
				<p>Create Project</p>
				<RiAddCircleFill onClick={open} className='size-6 text-neutral-500  ' />
			</div>
			{data?.documents.map((project) => {
				const href = `/workspaces/${workspaceId}/projects/${projectId}`;
				const isActive = pathname === href;

				return (
					<Link href={href} key={project.$id}>
						<div
							className={cn(
								`flex items py-2 rounded-full hover:opacity-75 transition cursor-pointer`,
								isActive && 'bg-white shadow-md hover:opacity-100 text-primary'
							)}
						>
							<ProjectAvatar image={project.imageUrl} name={project.name} />
							<span className='ml-2 truncate flex items-center'>
								{project.name}
							</span>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
export default Projects;
