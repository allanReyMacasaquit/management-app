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
import { ImageIcon, Loader } from 'lucide-react';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';

// import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createProjectSchema } from '../schemas';
import { useCreateProjects } from '../hooks/use-create-projects';
import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';

interface CreateProjectFormProps {
	onCancel?: () => void;
}

function CreateProjectForm({ onCancel }: CreateProjectFormProps) {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const inputRef = useRef<HTMLInputElement>(null);
	const { mutate, isPending } = useCreateProjects();
	const form = useForm<z.infer<typeof createProjectSchema>>({
		resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
		defaultValues: {
			name: '',
		},
	});

	// const router = useRouter();

	// State to manage the image file and its preview
	const [imageFile, setImageFile] = useState<File | undefined>(undefined);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	// Submit handler for the form
	const onSubmit = async (values: z.infer<typeof createProjectSchema>) => {
		// Prepare the final form values
		const finalValues = {
			...values,
			workspaceId,
			image: imageFile, // Send the image file to the backend
		};

		// Call the mutate function to trigger the upload
		mutate(
			{ form: finalValues },
			{
				onSuccess: ({ data }) => {
					form.reset();
					router.push(`/projects/${data.$id}`);
				},
			}
		);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file)); // Create a preview for the selected image
		}
	};

	return (
		<Card className='w-full h-full bg-gradient-to-t from-slate-600/50 to-slate-300 shadow-none mt-4 border-none rounded-none'>
			<CardHeader className='flex'>
				<CardTitle className='text-2xl text-center -mb-5 lg:-mb-10'>
					Create a new project
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
										<Input {...field} placeholder='Enter Project Name' />
									</FormControl>
									{/* Show error message if validation fails */}
									{fieldState.error && (
										<FormMessage>{fieldState.error.message}</FormMessage>
									)}
								</FormItem>
							)}
						/>

						{/* Remove the unused field from image input */}
						<div className=' relative rounded-md overflow-hidden py-4'>
							<div className='flex flex-col gap-y-2'>
								<div className='flex items-center gap-x-5'>
									{imagePreview ? (
										<div>
											<Image
												src={imagePreview}
												alt='image'
												height={100}
												width={100}
												className='object-cover'
											/>
										</div>
									) : (
										<Avatar className='size-16'>
											<AvatarFallback>
												<ImageIcon className='size-9' />
											</AvatarFallback>
										</Avatar>
									)}
									<div className='flex flex-col py-8'>
										<p className='text-sm'>Project Icon</p>
										<p className='text-xs text-muted-foreground'></p>
										<input
											type='file'
											accept='.png, .jpg'
											className='hidden'
											ref={inputRef}
											disabled={isPending}
											onChange={handleImageChange}
										/>
										{imageFile ? (
											<Button
												type='button'
												variant='destructive'
												disabled={isPending}
												size='sm'
												className='w-fit mt-4'
												onClick={() => {
													// Clear the image file and preview
													setImageFile(undefined);
													setImagePreview(null);
													// Reset the file input
													if (inputRef.current) {
														inputRef.current.value = '';
													}
												}}
											>
												Remove Image
											</Button>
										) : (
											<Button
												type='button'
												variant='outline'
												disabled={isPending}
												size='sm'
												className='w-fit mt-4'
												onClick={() => inputRef.current?.click()}
											>
												Upload Image
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className='flex items-center justify-between space-x-2'>
							<Button variant='secondary' disabled={isPending} type='submit'>
								{isPending ? (
									<Loader size={20} className='text-white animate-spin' />
								) : (
									'Create Project'
								)}
							</Button>
							<Button
								disabled={isPending}
								type='button'
								variant='destructive'
								onClick={onCancel}
								className={cn(!onCancel && 'hidden')}
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

export default CreateProjectForm;
