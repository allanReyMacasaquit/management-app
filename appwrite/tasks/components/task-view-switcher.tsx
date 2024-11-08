'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader, PlusIcon } from 'lucide-react';
import useCreateTasksModal from '../hooks/use-create-tasks-modal';
import { useGetTasks } from '../hooks/use-get-tasks';
import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import { useQueryState } from 'nuqs';
import DataFilters from './data-filters';
import useFilterTasks from '../hooks/use-filter-tasks';

function TaskViewSwitcher() {
	const [{ assigneeId, dueDate, projectId, status }] = useFilterTasks();
	const [view, setView] = useQueryState('task-view', {
		defaultValue: 'table',
	});
	const workspaceId = useWorkspaceId();
	const { open } = useCreateTasksModal();
	const { data: tasks, isLoading: isLoadingTask } = useGetTasks({
		workspaceId,
		assigneeId,
		dueDate,
		projectId,
		status,
	});

	return (
		<Tabs
			defaultValue={view}
			onValueChange={setView}
			className='w-full flex-1 border rounded-lg'
		>
			<div className='h-full flex flex-col overflow-auto p-4'>
				<div className='flex flex-col gap-y-2 lg:flex-row justify-between'>
					<TabsList className='w-full lg:w-auto'>
						<TabsTrigger value='table' className='w-full h-8 lg:w-auto'>
							Table
						</TabsTrigger>
						<TabsTrigger value='kanban' className='w-full h-8 lg:w-auto'>
							Kanban
						</TabsTrigger>
						<TabsTrigger value='calendar' className='w-full h-8 lg:w-auto'>
							Calendar
						</TabsTrigger>
					</TabsList>
					<Button
						onClick={open}
						variant='primary'
						size='sm'
						className='lg:w-fit rounded-full'
					>
						<PlusIcon className='size-5 ' />
						New
					</Button>
				</div>
				<Separator className='bg-white my-4' />
				<DataFilters hideProjectFilter={false} />
				<Separator className='bg-white my-4' />

				{isLoadingTask ? (
					<div className='flex items-center justify-center min-h-56'>
						<Loader className='w-10 h-10 animate-spin text-muted-foreground' />
					</div>
				) : (
					<>
						<TabsContent value='table'>
							Data table {JSON.stringify(tasks)}
						</TabsContent>
						<TabsContent value='kanban'>
							Data kanban {JSON.stringify(tasks)}
						</TabsContent>
						<TabsContent value='calendar'>
							Data calendar {JSON.stringify(tasks)}
						</TabsContent>
					</>
				)}
			</div>
		</Tabs>
	);
}
export default TaskViewSwitcher;
