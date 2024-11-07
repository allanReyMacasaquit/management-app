'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DottedSeparator from '@/features/components/dotted-separator';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { useProjectId } from '@/appwrite/projects/hooks/use-project-id';
import { useCreateTasks } from '../hooks/use-create-tasks';
import { createTasksSchema } from '../schemas';
import {
	Archive,
	CheckCircle,
	ClipboardList,
	Eye,
	Loader2,
	RefreshCcw,
} from 'lucide-react';
import DatePicker from './date-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import MemberAvatar from '@/appwrite/members/components/member-avatar';
import { TaskStatus } from '../types';
import ProjectAvatar from '@/appwrite/projects/components/project-avatar';
import { useGetMembers } from '@/appwrite/members/hooks/use-get-member';

interface CreateTaskFormProps {
	onCancel?: () => void;
	projectOptions: { id: string; name: string; imageUrl: string }[];
	memberOptions: { id: string; name: string }[];
}

function CreateTaskForm({
	onCancel,
	projectOptions,
	memberOptions,
}: CreateTaskFormProps) {
	// const router = useRouter();
	const workspaceId = useWorkspaceId();
	const projectId = useProjectId();
	const { data } = useGetMembers({ workspaceId });

	const assigneeId = data?.documents.length ? data.documents[0].$id : '';

	const { mutate, isPending } = useCreateTasks();

	const form = useForm<z.infer<typeof createTasksSchema>>({
		resolver: zodResolver(createTasksSchema.omit({ workspaceId: true })),
		defaultValues: {
			workspaceId,
			name: '',
			status: TaskStatus.TODO,
			projectId,
			assigneeId,
			dueDate: new Date(),
		},
	});

	// Submit handler for the form
	const onSubmit = async (values: z.infer<typeof createTasksSchema>) => {
		mutate(
			{ json: { ...values, workspaceId } },
			{
				onSuccess: ({}) => {
					form.reset();
					onCancel?.();
					// router.push(
					// 	`/workspaces/${workspaceId}/projects/${projectId}/tasks/${data.$id}`
					// );
				},
			}
		);
	};

	return (
		<Card className='w-full h-full bg-gradient-to-t from-sky-300  shadow-none mt-4 border-none rounded-none'>
			<CardHeader className='flex'>
				<CardTitle className='text-2xl text-center -mb-5 lg:-mb-10'>
					Create a new task
				</CardTitle>
			</CardHeader>
			<div className='w-[150px] lg:w-[300px] mx-auto mt-8'>
				<DottedSeparator />
			</div>

			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							name='name'
							control={form.control}
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel className='ml-2'>Task Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder='Enter Task Name' />
									</FormControl>
									<div className='ml-2'>
										{fieldState.error && (
											<FormMessage>{fieldState.error.message}</FormMessage>
										)}
									</div>
								</FormItem>
							)}
						/>
						<FormField
							name='projectId'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<Select
										defaultValue={field.value}
										onValueChange={field.onChange}
									>
										<div className='pt-6'>
											<FormLabel className='ml-2'>Project Name</FormLabel>
										</div>

										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select Project' />
											</SelectTrigger>
										</FormControl>
										<FormMessage>
											<SelectContent>
												{projectOptions.map((project) => (
													<SelectItem key={project.id} value={project.id}>
														<div className='flex items-center gap-x-2'>
															<ProjectAvatar
																image={project.imageUrl}
																className='size-6'
																name={project.name}
															/>
															{project.name}
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</FormMessage>
									</Select>
								</FormItem>
							)}
						/>
						<FormField
							name='assigneeId'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<Select
										defaultValue={field.value}
										onValueChange={field.onChange}
									>
										<div className='pt-6'>
											<FormLabel className='ml-2'> Assignee Name</FormLabel>
										</div>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select Assignee' />
											</SelectTrigger>
										</FormControl>
										<FormMessage>
											<SelectContent>
												{memberOptions.map((member) => (
													<SelectItem key={member.id} value={member.id}>
														<div className='flex items-center gap-x-2'>
															<MemberAvatar
																className='size-6'
																name={member.name}
															/>
															{member.name}
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</FormMessage>
									</Select>
								</FormItem>
							)}
						/>
						<FormField
							name='status'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<Select
										defaultValue={field.value}
										onValueChange={field.onChange}
									>
										<div className='pt-6'>
											<FormLabel className='ml-2'>Status</FormLabel>
										</div>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select Status' />
											</SelectTrigger>
										</FormControl>
										<FormMessage>
											<SelectContent>
												<SelectItem value={TaskStatus.TODO}>
													<div className='flex items-center'>
														<ClipboardList className='text-purple-500' />
														<span className='ml-2'>TODO</span>
													</div>
												</SelectItem>
												<SelectItem value={TaskStatus.IN_PROGRESS}>
													<div className='flex items-center'>
														<RefreshCcw className='text-blue-500' />
														<span className='ml-2'>IN_PROGRESS</span>
													</div>
												</SelectItem>
												<SelectItem value={TaskStatus.DONE}>
													<div className='flex items-center'>
														<CheckCircle className='text-green-500' />
														<span className='ml-2'>Done</span>
													</div>
												</SelectItem>
												<SelectItem value={TaskStatus.IN_REVIEW}>
													<div className='flex items-center'>
														<Eye className='text-orange-500' />
														<span className='ml-2'>IN_REVIEW</span>
													</div>
												</SelectItem>
												<SelectItem value={TaskStatus.BACKLOG}>
													<div className='flex items-center'>
														<Archive className='text-red-500' />
														<span className='ml-2'>BACKLOG</span>
													</div>
												</SelectItem>
											</SelectContent>
										</FormMessage>
									</Select>
								</FormItem>
							)}
						/>

						<FormField
							name='dueDate'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<div className='pt-6'>
										<FormLabel className='ml-2'>Target Date</FormLabel>
									</div>
									<FormControl>
										<DatePicker {...field} />
									</FormControl>
								</FormItem>
							)}
						/>

						<div className='flex mt-6 items-center justify-between space-x-2'>
							<Button variant='secondary' disabled={isPending} type='submit'>
								{isPending ? (
									<Loader2 size={20} className='text-white animate-spin' />
								) : (
									'Create Task'
								)}
							</Button>
							<Button
								disabled={isPending}
								type='button'
								variant='destructive'
								onClick={onCancel}
							>
								Cancel
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

export default CreateTaskForm;
