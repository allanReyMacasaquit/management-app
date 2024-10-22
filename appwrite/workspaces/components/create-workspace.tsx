'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { workspacesSchema } from '../schemas';
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
import { useWorkspaces } from '../hooks/use-workspaces';
import { Loader } from 'lucide-react';

interface CreateWorkspaceFormProps {
	onCancel?: () => void;
}

function CreateWorkspaceForm({ onCancel }: CreateWorkspaceFormProps) {
	const { mutate, isPending } = useWorkspaces();
	const form = useForm<z.infer<typeof workspacesSchema>>({
		resolver: zodResolver(workspacesSchema),
		defaultValues: {
			name: '',
		},
	});

	// Submit handler for the form
	const onSubmit = (values: z.infer<typeof workspacesSchema>) => {
		mutate({ json: values });
	};

	return (
		<Card className='w-full h-full border-none shadow-none'>
			<CardHeader className='flex'>
				<CardTitle className='text-2xl font-bold'>
					Create a new workspace
				</CardTitle>
			</CardHeader>
			<DottedSeparator />
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							name='name'
							control={form.control}
							render={({ field, fieldState }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder='Enter workspace name' />
									</FormControl>
									{/* Show error message if validation fails */}
									{fieldState.error && (
										<FormMessage>{fieldState.error.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>
						<div className='flex items-center justify-between'>
							<Button
								variant='primary'
								disabled={isPending}
								type='submit'
								className='mt-4'
							>
								{isPending ? <Loader size={4} /> : 'Create Workspace'}
							</Button>
							<Button
								disabled={isPending}
								type='button'
								variant='destructive'
								onClick={onCancel}
								className='mt-4 ml-2'
							>
								{isPending ? <Loader size={4} /> : 'Cancel'}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

export default CreateWorkspaceForm;
