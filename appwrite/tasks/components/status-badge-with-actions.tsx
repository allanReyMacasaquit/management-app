import { MoreVerticalIcon } from 'lucide-react';
import StatusBadge from './status-badge';
import TaskActions from './task-actions';
import { Button } from '@/components/ui/button';
import { TaskStatus } from '../types';

interface StatusBadgeWithActionsProps {
	status: TaskStatus;
	id: string;
	projectId: string;
}
function StatusBadgeWithActions({
	status,
	id,
	projectId,
}: StatusBadgeWithActionsProps) {
	return (
		<div className='relative w-[320px]'>
			<div className='cursor-pointer tracking-widest'>
				<StatusBadge status={status} />
				<div className='absolute top-1 right-0'>
					<TaskActions id={id} projectId={projectId}>
						<Button variant='ghost' className='size-8 p-0 hover:bg-transparent'>
							<MoreVerticalIcon className='size-4' />
						</Button>
					</TaskActions>
				</div>
			</div>
		</div>
	);
}

export default StatusBadgeWithActions;
