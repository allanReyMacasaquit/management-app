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
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { useProjectId } from '@/appwrite/projects/hooks/use-project-id';
import { useCreateTasks } from '../hooks/use-create-tasks';
import { createTasksSchema } from '../schemas';
import { Loader2 } from 'lucide-react';
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
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const projectId = useProjectId();

	const { mutate, isPending } = useCreateTasks();
	const form = useForm<z.infer<typeof createTasksSchema>>({
		resolver: zodResolver(createTasksSchema.omit({ workspaceId: true })),
		defaultValues: {
			workspaceId,
		},
	});

	// Submit handler for the form
	const onSubmit = async (values: z.infer<typeof createTasksSchema>) => {
		mutate(
			{ json: { ...values, workspaceId } },
			{
				onSuccess: ({ data }) => {
					form.reset();
					router.push(
						`/workspaces/${workspaceId}/projects/${projectId}/tasks/${data.$id}`
					);
				},
			}
		);
	};

	return (
		<Card className='w-full h-full bg-gradient-to-t from-slate-600/50 to-slate-300 shadow-none mt-4 border-none rounded-none'>
			<CardHeader className='flex'>
				<CardTitle className='text-2xl text-center -mb-5 lg:-mb-10'>
					Create a new task
				</CardTitle>
			</CardHeader>
			<div className='w-[150px] lg:w-[300px] mx-auto'>
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
									<FormControl>
										<Input {...field} placeholder='Enter Task Name' />
									</FormControl>
									{/* Show error message if validation fails */}
									{fieldState.error && (
										<FormMessage>{fieldState.error.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>

						<div className='flex mt-4 items-center justify-between space-x-2'>
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
