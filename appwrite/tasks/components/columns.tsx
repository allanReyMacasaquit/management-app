'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Task } from '../types';
import { Button } from '@/components/ui/button';
import ProjectAvatar from '@/appwrite/projects/components/project-avatar';
import MemberAvatar from '@/appwrite/members/components/member-avatar';
import TaskDate from './task-date';
import StatusBadgeWithActions from './status-badge-with-actions';
import { ArrowUpDown } from 'lucide-react';
import NameAvatar from './name-avatar';

export const columns: ColumnDef<Task>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<div className='w-[320px] lg:w-full'>
					<Button
						variant='outline'
						className='bg-blue-200 hover:bg-blue-200/80'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Task:
						<ArrowUpDown className='ml-2 size-4' />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const name = row.original.name;
			return (
				<div className='flex items-center  gap-x-2 text-sm font-medium'>
					<NameAvatar
						name={name}
						fallbackClassName='text-sm'
						className='size-6 justify-start hidden lg:flex'
					/>
					<p className='p-2 tracking-widest w-[320px] lg:w-full rounded bg-slate-50'>
						{name}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: 'status',
		header: ({ column }) => (
			<div className='w-[320px] lg:w-full'>
				<Button
					variant='outline'
					className='bg-blue-200 hover:bg-blue-200/80'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Status
					<ArrowUpDown className='ml-2 size-4' />
				</Button>
			</div>
		),
		cell: ({ row }) => {
			const { status, $id, projectId } = row.original;

			return (
				<StatusBadgeWithActions
					status={status}
					id={$id}
					projectId={projectId}
				/>
			);
		},
	},
	{
		accessorKey: 'dueDate',
		header: ({ column }) => {
			return (
				<div className='w-[320px] lg:w-full'>
					<Button
						variant='outline'
						className='bg-blue-200 hover:bg-blue-200/80'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Due Date
						<ArrowUpDown className='ml-2 size-4' />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const dueDate = row.original.dueDate;
			return <TaskDate value={dueDate} />;
		},
	},
	{
		accessorKey: 'assigneeId',
		header: ({ column }) => {
			return (
				<div className='w-[320px] lg:w-full'>
					<Button
						variant='outline'
						className='bg-blue-200 hover:bg-blue-200/80'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Assignee
						<ArrowUpDown className='ml-2 size-4' />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const assignee = row.original.assignee;
			return (
				<div className='flex items-center w-[320px] lg:w-full gap-x-2 text-sm font-medium'>
					<MemberAvatar
						name={assignee.name}
						fallbackClassName='text-sm'
						className='size-6'
					/>
					<p className='line-clamp-1'>{assignee.name}</p>
				</div>
			);
		},
	},
	{
		accessorKey: 'projectId',
		header: ({ column }) => {
			return (
				<div className='w-[320px] lg:w-full'>
					<Button
						variant='outline'
						className='bg-blue-200 hover:bg-blue-200/80'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Project
						<ArrowUpDown className='ml-2 size-4' />
					</Button>
				</div>
			);
		},
		cell: ({ row }) => {
			const project = row.original.project;
			return (
				<div className='flex items-center w-[320px] lg:w-full gap-x-2 text-sm font-medium'>
					<ProjectAvatar
						name={project.name}
						image={project.imageUrl}
						className='size-6'
					/>
					<p className='line-clamp-1'>{project.name}</p>
				</div>
			);
		},
	},
];
