import { useCallback, useEffect, useState } from 'react';
import { Task, TaskStatus } from '../../types';
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from '@hello-pangea/dnd';
import ColumnHeaderKanban from './column-header-kanban';
import CardKanban from './card-kanban';
import { Separator } from '@/components/ui/separator';

interface DataKanbanProps {
	data: Task[];
	onChange: (
		task: {
			$id: string;
			status: TaskStatus;
			position: number;
		}[]
	) => void;
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

function DataKanban({ data, onChange }: DataKanbanProps) {
	const [tasks, setTasks] = useState<TaskState>(() => {
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
	// useEffect to update tasks state whenever `data` changes
	useEffect(() => {
		const updatedTasks: TaskState = {
			[TaskStatus.TODO]: [],
			[TaskStatus.IN_PROGRESS]: [],
			[TaskStatus.DONE]: [],
			[TaskStatus.BACKLOG]: [],
			[TaskStatus.IN_REVIEW]: [],
		};

		data.forEach((task) => {
			updatedTasks[task.status].push(task);
		});

		Object.keys(updatedTasks).forEach((status) => {
			updatedTasks[status as TaskStatus].sort(
				(a, b) => a.position - b.position
			);
		});

		setTasks(updatedTasks);
	}, [data]);

	const onDragEnd = useCallback(
		(result: DropResult) => {
			if (!result.destination) return;

			const { source, destination } = result;
			const sourceStatus = source.droppableId as TaskStatus;
			const destinationStatus = destination.droppableId as TaskStatus;

			const updatesPayload: {
				$id: string;
				status: TaskStatus;
				position: number;
			}[] = [];

			setTasks((prevTasks) => {
				const newTasks = { ...prevTasks };

				// Safely remove the task from the source column
				const sourceColumn = [...newTasks[sourceStatus]];
				const [movedTask] = sourceColumn.splice(source.index, 1);

				if (!movedTask) {
					return prevTasks;
				}

				const updatedMovedTask =
					sourceStatus !== destinationStatus
						? { ...movedTask, status: destinationStatus }
						: movedTask;

				newTasks[sourceStatus] = sourceColumn;

				const destinationColumn = [...newTasks[destinationStatus]];

				destinationColumn.splice(destination.index, 0, updatedMovedTask);

				newTasks[destinationStatus] = destinationColumn;

				// Push task update to the payload
				updatesPayload.push({
					$id: updatedMovedTask.$id,
					status: destinationStatus,
					position: Math.min((destination.index + 1) * 1000, 1_000_000),
				});

				newTasks[destinationStatus].forEach((task, index) => {
					if (task.$id !== updatedMovedTask.$id) {
						const newPosition = Math.min((index + 1) * 1000, 1_000_000);
						if (task.position !== newPosition) {
							updatesPayload.push({
								$id: task.$id,
								status: destinationStatus,
								position: newPosition,
							});
						}
					}
				});

				if (sourceStatus !== destinationStatus) {
					newTasks[sourceStatus].forEach((task, index) => {
						if (task) {
							const newPosition = Math.min((index + 1) * 1000, 1_000_000);
							if (task.position !== newPosition) {
								updatesPayload.push({
									$id: task.$id,
									status: sourceStatus,
									position: newPosition,
								});
							}
						}
					});
				}

				return newTasks;
			});

			// Pass the whole updatesPayload array to onChange
			if (updatesPayload.length > 0) {
				onChange(updatesPayload);
			}
		},
		[onChange]
	);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className='flex overflow-x-auto py-1'>
				{boards.map((board) => {
					return (
						<div
							key={board}
							className='flex-1 mx-2 bg-muted p-2 border rounded shadow'
						>
							<ColumnHeaderKanban
								board={board}
								taskCount={tasks[board].length}
							/>
							<Separator className='mt-2' />
							<Droppable droppableId={board}>
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className='min-h-[200px] py-2'
									>
										{tasks[board].map((task, index) => (
											<Draggable
												key={task.$id}
												draggableId={task.$id}
												index={index}
											>
												{(provided) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														style={{
															...provided.draggableProps.style,
														}}
														className='p-1 mb-2 w-[320px] lg:w-full bg-gray-200 border-none shadow-md rounded border-gray-600'
													>
														<CardKanban task={task} />
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</div>
					);
				})}
			</div>
		</DragDropContext>
	);
}

export default DataKanban;
