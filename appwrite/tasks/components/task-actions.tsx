import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useConfirm } from '@/components/user/use-confirm';
import {
	ExternalLinkIcon,
	Folder,
	Loader,
	PencilIcon,
	Trash,
} from 'lucide-react';
import { useDeleteTasks } from '../hooks/use-delete-tasks';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import useUpdateTasksModal from '../hooks/use-update-tasks-modal';

interface TaskActionsProps {
	id: string;
	projectId: string;
	children: React.ReactNode;
}
function TaskActions({ id, projectId, children }: TaskActionsProps) {
	const router = useRouter();
	const workspaceId = useWorkspaceId();

	const { open } = useUpdateTasksModal();
	const [ConfirmDialog, confirm] = useConfirm(
		'Delete task',
		'This action cannot be undone.',
		'destructive'
	);

	const { mutate, isPending } = useDeleteTasks();

	const onDelete = async () => {
		const ok = await confirm();
		if (!ok) return;

		mutate({ param: { taskId: id } });
	};

	const onOpenTask = () => {
		router.push(`/workspaces/${workspaceId}/tasks/${id}`);
	};

	const onOpenProject = () => {
		router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
	};

	return (
		<div className='flex justify-end'>
			<ConfirmDialog />
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-40 mt-1'>
					<DropdownMenuItem onClick={onOpenTask} className='font-medium p-3'>
						<ExternalLinkIcon className='size-4 mr-2 stroke-2' />
						Task Details
					</DropdownMenuItem>
					<DropdownMenuItem onClick={onOpenProject} className='font-medium p-3'>
						<Folder className='size-4 mr-2 stroke-2' />
						Open Project
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => open(id)}
						className='font-medium p-3'
					>
						<PencilIcon className='size-4 mr-2 stroke-2' />
						Edit Task
					</DropdownMenuItem>
					<Separator />
					<DropdownMenuItem
						onClick={onDelete}
						disabled={isPending}
						className='font-medium p-3'
					>
						<Trash className='size-4 mr-2 stroke-2 text-red-500' />
						{isPending ? (
							<Loader className='size-6 text-muted-foreground' />
						) : (
							'Delete Task'
						)}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
export default TaskActions;
