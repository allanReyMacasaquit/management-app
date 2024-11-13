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
import { DataTable } from './data-table';
import { columns } from './columns';
import DataKanban from './kanban/data-kanban';
import { useBulkUpdateTasks } from '../hooks/use-bulk-update-tasks';
import { TaskStatus } from '../types';
import DataCalendar from './calendar/data-calendar';

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

	const { mutate } = useBulkUpdateTasks();

	const handleBulkUpdate = (
		updatedTasks: { $id: string; status: TaskStatus; position: number }[]
	) => {
		const payload = {
			json: {
				tasks: updatedTasks,
			},
		};

		mutate(payload);
	};

	return (
		<Tabs
			defaultValue={view}
			onValueChange={setView}
			className='w-full flex-1 border rounded-lg'
		>
			<div className='h-full flex flex-col overflow-auto p-4'>
				<div className='flex items-center gap-y-2 lg:flex-row justify-between'>
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
					<div className='flex justify-end my-2 ml-2'>
						<Button
							onClick={open}
							variant='primary'
							size='sm'
							className='w-fit rounded-full'
						>
							<PlusIcon className='size-5' />
							New Task
						</Button>
					</div>
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
							<DataTable columns={columns} data={tasks?.documents ?? []} />
						</TabsContent>
						<TabsContent value='kanban'>
							<DataKanban
								data={tasks?.documents ?? []}
								onChange={handleBulkUpdate}
							/>
						</TabsContent>
						<TabsContent value='calendar'>
							<DataCalendar data={tasks?.documents ?? []} />
						</TabsContent>
					</>
				)}
			</div>
		</Tabs>
	);
}
export default TaskViewSwitcher;
