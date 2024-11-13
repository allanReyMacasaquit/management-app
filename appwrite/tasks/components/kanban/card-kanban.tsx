import { Task } from '../../types';
import TaskActions from '../task-actions';
import { MoreHorizontalIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import TaskDate from '../task-date';
import ProjectAvatar from '@/appwrite/projects/components/project-avatar';

interface CardKanbanProps {
	task: Task;
}
function CardKanban({ task }: CardKanbanProps) {
	return (
		<>
			<div className='flex items-center'>
				<ProjectAvatar
					name={task.project.name}
					image={task.project.imageUrl}
					className='size-10 mr-3'
				/>
				<span>{task.project.name}</span>
			</div>
			<Separator className='mb-1 bg-white' />
			<div className='flex items-center gap-x-1 mb-1'>
				<TaskDate value={task.dueDate} className='text-sm' />
			</div>
			<Separator className='mb-1 bg-white' />
			<div className='bg-white p-2 rounded space-y-3'>
				<p className='text-sm line-clamp-2'>{task.name}</p>
				<TaskActions id={task.$id} projectId={task.projectId}>
					<MoreHorizontalIcon className='size-5 stroke-1 shrink-0 text-muted-foreground' />
				</TaskActions>
			</div>
		</>
	);
}
export default CardKanban;
