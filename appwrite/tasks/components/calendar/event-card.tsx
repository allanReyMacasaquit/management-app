import { Project } from '@/appwrite/projects/types';
import { TaskStatus } from '../../types';
import { cn } from '@/lib/utils';
import MemberAvatar from '@/appwrite/members/components/member-avatar';
import ProjectAvatar from '@/appwrite/projects/components/project-avatar';
import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';

interface EventCardProps {
	title: string;
	assignee: any;
	project: Project;
	status: TaskStatus;
	$id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
	[TaskStatus.TODO]: 'border-l-purple-500 bg-purple-500',
	[TaskStatus.IN_PROGRESS]: 'border-l-blue-500 bg-blue-500',
	[TaskStatus.IN_REVIEW]: 'border-l-orange-500 bg-orange-500',
	[TaskStatus.DONE]: 'border-l-green-500 bg-green-500',
	[TaskStatus.BACKLOG]: 'border-l-red-500 bg-red-500',
};

function EventCard({ $id, assignee, project, status, title }: EventCardProps) {
	const workspaceId = useWorkspaceId();
	const router = useRouter();

	const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		console.log(`/workspaces/${workspaceId}/tasks/${$id}`);
		router.push(`/workspaces/${workspaceId}/tasks/${$id}`);
	};

	return (
		<div>
			<div
				onClick={onClick}
				className={cn(
					'text-sm px-2 hidden text-white capitalize border rounded lg:flex flex-col cursor-pointer transition',
					statusColorMap[status]
				)}
			>
				<p>{title}</p>
				<div className='flex items-center gap-x-1'>
					<MemberAvatar name={assignee?.name} className='size-5 ' />
					<ProjectAvatar
						name={project?.name}
						className='size-6'
						image={project?.imageUrl}
					/>
				</div>
			</div>
		</div>
	);
}
export default EventCard;
