import { useGetProjects } from '@/appwrite/projects/hooks/use-get-projects';
import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import {
	Archive,
	CheckCircle,
	ClipboardList,
	Eye,
	Folder,
	ListCheckIcon,
	RefreshCcw,
	UserIcon,
} from 'lucide-react';
import { TaskStatus } from '../types';
import useFilterTasks from '../hooks/use-filter-tasks';
import { useGetMembers } from '@/appwrite/members/hooks/use-get-member';
import DatePicker from './date-picker';

interface DataFiltersProps {
	hideProjectFilter: boolean;
}

function DataFilters({ hideProjectFilter }: DataFiltersProps) {
	const workspaceId = useWorkspaceId();
	const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
		workspaceId,
	});
	const { data: members, isLoading: isLoadingMembers } = useGetMembers({
		workspaceId,
	});

	const isLoading = isLoadingProjects || isLoadingMembers;

	const projectsOptions = projects?.documents.map((project) => ({
		value: project.$id,
		label: project.name,
	}));

	const membersOptions = members?.documents.map((member) => ({
		value: member.$id,
		label: member.name,
	}));

	const [{ assigneeId, dueDate, projectId, search, status }, setFilters] =
		useFilterTasks();

	const onStatusChange = (value: string) => {
		setFilters({ status: value === 'all' ? null : (value as TaskStatus) });
	};

	const onAssigneeChange = (value: string) => {
		setFilters({ assigneeId: value === 'all' ? null : (value as string) });
	};

	const onProjectChange = (value: string) => {
		setFilters({
			projectId: value === 'all' ? null : (value as string),
		});
	};

	if (isLoading) return null;

	return (
		<div className='flex flex-col items-center lg:flex-row gap-2'>
			{/* Status */}
			<Select
				defaultValue={status ?? undefined}
				onValueChange={(value) => onStatusChange(value)}
			>
				<SelectTrigger className='w-full lg:w-auto h-8'>
					<div className='flex items-center pr-2'>
						<ListCheckIcon className='size-5 mr-2 text-blue-700' />
						<SelectValue placeholder='All Statuses' />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>All Statuses</SelectItem>
					<SelectSeparator />
					<SelectItem value={TaskStatus.TODO}>
						<div className='flex items-center'>
							<ClipboardList className='size-6 mr-2 text-purple-500' />
							TODO
						</div>
					</SelectItem>
					<SelectItem value={TaskStatus.IN_PROGRESS}>
						<div className='flex items-center'>
							<RefreshCcw className='size-5 mr-2 text-blue-500' />
							IN_PROGRESS
						</div>
					</SelectItem>
					<SelectItem value={TaskStatus.IN_REVIEW}>
						<div className='flex items-center'>
							<Eye className='size-6 mr-2 text-orange-500' />
							IN_REVIEW
						</div>
					</SelectItem>
					<SelectItem value={TaskStatus.DONE}>
						<div className='flex items-center'>
							<CheckCircle className='size-5 mr-2 text-green-500' />
							DONE
						</div>
					</SelectItem>

					<SelectItem value={TaskStatus.BACKLOG}>
						<div className='flex items-center'>
							<Archive className='size-5 mr-2 text-red-500' />
							BACKLOG
						</div>
					</SelectItem>
				</SelectContent>
			</Select>
			{/* AssigneeId */}
			<Select
				defaultValue={assigneeId ?? undefined}
				onValueChange={(value) => onAssigneeChange(value)}
			>
				<SelectTrigger className='w-full lg:w-auto h-8'>
					<div className='flex items-center pr-2'>
						<UserIcon className='size-5 mr-2 text-blue-700' />
						<SelectValue placeholder='All Assignees' />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>All Assignees</SelectItem>
					<SelectSeparator />
					{membersOptions?.map((member) => (
						<SelectItem key={member.value} value={member.value}>
							{member.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{/* ProjectId */}
			<Select
				defaultValue={projectId ?? undefined}
				onValueChange={(value) => onProjectChange(value)}
			>
				<SelectTrigger className='w-full lg:w-auto h-8'>
					<div className='flex items-center pr-2'>
						<Folder className='size-5 mr-2 text-blue-700' />
						<SelectValue placeholder='All Projects' />
					</div>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>All Projects</SelectItem>
					<SelectSeparator />
					{projectsOptions?.map((project) => (
						<SelectItem key={project.value} value={project.value}>
							{project.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{/* DATE PICKER */}
			<div className='w-full lg:w-auto'>
				<DatePicker
					className=' bg-slate-200 text-black text-sm h-8 mt-0'
					placeholder='Due Date'
					value={dueDate ? new Date(dueDate) : undefined}
					onChange={(date) => {
						setFilters({ dueDate: date ? date.toISOString() : null });
					}}
				/>
			</div>
		</div>
	);
}
export default DataFilters;
