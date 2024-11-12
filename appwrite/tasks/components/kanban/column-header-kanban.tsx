import {
	Archive,
	CheckCircle,
	ClipboardList,
	Eye,
	PlusIcon,
	RefreshCcw,
} from 'lucide-react';
import { TaskStatus } from '../../types';
import { Button } from '@/components/ui/button';
import useCreateTasksModal from '../../hooks/use-create-tasks-modal';

interface ColumnHeaderKanbanProps {
	board: TaskStatus;
	taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
	[TaskStatus.TODO]: <ClipboardList className='size-6 mr-2 text-purple-500' />,
	[TaskStatus.IN_PROGRESS]: (
		<RefreshCcw className='size-5 mr-2 text-blue-500' />
	),
	[TaskStatus.IN_REVIEW]: <Eye className='size-6 mr-2 text-orange-500' />,
	[TaskStatus.DONE]: <CheckCircle className='size-5 mr-2 text-green-500' />,
	[TaskStatus.BACKLOG]: <Archive className='size-5 mr-2 text-red-500' />,
};
function ColumnHeaderKanban({ board, taskCount }: ColumnHeaderKanbanProps) {
	const icon = statusIconMap[board];
	return (
		<div className='flex w-[320px] lg:w-full items-center justify-between '>
			<div className='flex items-center gap-x-2'>
				<div>{icon}</div>
				<h2 className='text-sm'>{board}</h2>
			</div>
			<div className='text-blue-700 rounded-md px-4 shadow shadow-slate-200 bg-white border text-lg'>
				{taskCount}
			</div>
		</div>
	);
}
export default ColumnHeaderKanban;
