import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ExternalLinkIcon, Folder, PencilIcon, Trash } from 'lucide-react';

interface TaskActionsProps {
	id: string;
	projectId: string;
	children: React.ReactNode;
}
function TaskActions({ id, projectId, children }: TaskActionsProps) {
	return (
		<div className='flex justify-end'>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-40 mt-1'>
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
						className='font-medium p-3'
					>
						<ExternalLinkIcon className='size-4 mr-2 stroke-2' />
						Task Details
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
						className='font-medium p-3'
					>
						<Folder className='size-4 mr-2 stroke-2' />
						Open Project
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
						className='font-medium p-3'
					>
						<PencilIcon className='size-4 mr-2 stroke-2' />
						Edit Task
					</DropdownMenuItem>
					<Separator />
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
						className='font-medium p-3'
					>
						<Trash className='size-4 mr-2 stroke-2 text-red-500' />
						Delete Task
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
export default TaskActions;
