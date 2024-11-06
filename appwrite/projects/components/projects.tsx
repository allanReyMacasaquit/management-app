'use client';

import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import { RiAddCircleFill } from 'react-icons/ri';
import { useGetProjects } from '../hooks/use-get-projects';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import useCreateProjectsModal from '../hooks/use-create-projects-modal';
import WorkspaceAvatar from '@/appwrite/workspaces/components/workspace-avatar';

function Projects() {
	const pathname = usePathname();
	const workspaceId = useWorkspaceId();
	const { data } = useGetProjects({
		workspaceId,
	});
	const { open } = useCreateProjectsModal();

	return (
		<div className='flex flex-col rounded-lg'>
			<div className='flex items-center capitalize justify-between p-4 border rounded-xl mt-4'>
				{data?.documents?.length === 1
					? 'Project'
					: data?.documents.length || 0 > 1
					? 'Projects'
					: 'Create Project'}

				<RiAddCircleFill onClick={open} className='size-6 text-neutral-500  ' />
			</div>
			{data?.documents.map((project) => {
				const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
				const isActive = pathname === href;

				return (
					<Link href={href} key={project.$id}>
						<div
							className={cn(
								`flex items p-1 mt-2 rounded-lg text-muted-foreground hover:opacity-75 transition cursor-pointer`,
								isActive &&
									'shadow-md bg-blue-300 hover:opacity-75 border transition text-black'
							)}
						>
							<WorkspaceAvatar image={project.imageUrl} name={project.name} />
							<span className='ml-2 truncate flex items-center capitalize'>
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
