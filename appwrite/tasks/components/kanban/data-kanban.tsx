import { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import ColumnHeaderKanban from './column-header-kanban';

interface DataKanbanProps {
	data: Task[];
}

const boards: TaskStatus[] = [
	TaskStatus.BACKLOG,
	TaskStatus.DONE,
	TaskStatus.IN_PROGRESS,
	TaskStatus.IN_REVIEW,
	TaskStatus.TODO,
];

type TaskState = {
	[key in TaskStatus]: Task[];
};

function DataKanban({ data }: DataKanbanProps) {
	const [task, setTask] = useState<TaskState>(() => {
		const initialTasks: TaskState = {
			[TaskStatus.TODO]: [],
			[TaskStatus.IN_PROGRESS]: [],
			[TaskStatus.DONE]: [],
			[TaskStatus.BACKLOG]: [],
			[TaskStatus.IN_REVIEW]: [],
		};

		data.forEach((task) => {
			initialTasks[task.status].push(task);
		});

		Object.keys(initialTasks).forEach((status) => {
			initialTasks[status as TaskStatus].sort(
				(a, b) => a.position - b.position
			);
		});

		return initialTasks;
	});

	return (
		<DragDropContext onDragEnd={() => {}}>
			<div className='flex overflow-x-auto py-1'>
				{boards.map((board) => {
					return (
						<div
							key={board}
							className='flex-1 mx-2 bg-muted p-2 border rounded shadow'
						>
							<ColumnHeaderKanban
								board={board}
								taskCount={task[board].length}
							/>
						</div>
					);
				})}
			</div>
		</DragDropContext>
	);
}
export default DataKanban;
