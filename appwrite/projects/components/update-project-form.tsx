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
import { ArrowLeftIcon, ImageIcon, Loader } from 'lucide-react';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { Project } from '../types';

import { toast } from 'sonner';
import { useConfirm } from '@/components/user/use-confirm';
import { useDeleteProjects } from '../hooks/use-delete-projects';
import { useUpdateProject } from '../hooks/use-update-project';
import { updateProjectSchema } from '../schemas';

interface UpdateProjectFormProps {
	onCancel?: () => void;
	initialValues: Project;
}

function UpdateProjectForm({
	onCancel,
	initialValues,
}: UpdateProjectFormProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { mutate, isPending } = useUpdateProject();

	const { mutate: deleteProject, isPending: isDeletingProject } =
		useDeleteProjects();

	const [DeleteDialog, confirmDelete] = useConfirm(
		'Delete Workspace',
		'The action cannot be undone',
		'destructive'
	);

	const form = useForm<z.infer<typeof updateProjectSchema>>({
		resolver: zodResolver(updateProjectSchema),
		defaultValues: {
			...initialValues,
			image: initialValues.imageUrl ?? '',
		},
	});

	const router = useRouter();

	// State to manage the image file and its preview
	const [imageFile, setImageFile] = useState<File | undefined>(undefined);
	const [imagePreview, setImagePreview] = useState<string | null>(
		initialValues.imageUrl ?? null
	);

	const handleSaveChanges = () => {
		const url = `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`;
		router.push(url);
	};
	const onSubmit = async (values: z.infer<typeof updateProjectSchema>) => {
		const url = `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`;

		const finalValues = {
			...values,
			image: imageFile, // Send the image file to the backend
		};

		// Call the mutate function to trigger the upload
		mutate(
			{ form: finalValues, param: { projectId: initialValues.$id } },

			{
				onSuccess: () => {
					form.reset();
					router.push(url);
					handleSaveChanges();
				},
				onError: (error) => {
					// Handle error (e.g., show a notification or alert)
					console.error('Error updating workspace:', error);
					alert('Failed to update workspace. Please try again.');
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

	const handleDelete = async () => {
		const ok = await confirmDelete();
		if (!ok) return;
		deleteProject(
			{
				param: { projectId: initialValues.$id },
			},
			{
				onSuccess: () => {
					router.push('/');
				},
				onError: (error) => {
					console.error('Error deleting workspace:', error);
					toast.error('Failed to delete workspace. Please try again.');
				},
			}
		);
	};

	return (
		<div>
			<DeleteDialog />
			<Card className='border-none shadow-none'>
				<CardHeader className='flex gap-x-4 p-7 space-y-0'>
					<div className='flex items-center justify-between'>
						<Button
							onClick={
								onCancel
									? onCancel
									: () =>
											router.push(
												`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`
											)
							}
							variant='outline'
							className='w-fit'
						>
							<ArrowLeftIcon size={14} />
							Back
						</Button>
						<CardTitle className='text-2xl uppercase lg:mr-20'>
							{initialValues.name}
						</CardTitle>
						<div></div>
					</div>
				</CardHeader>
				<div className='w-[300px] lg:w-[200px] mx-auto'>
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

							{/* Image upload section */}
							<div className='relative rounded-md overflow-hidden py-4'>
								<div className='flex flex-col'>
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
											<Avatar>
												<AvatarFallback>
													<ImageIcon className='size-9' />
												</AvatarFallback>
											</Avatar>
										)}
										<div className='flex flex-col'>
											<p className='text-sm'>Workplace Icon</p>
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
								<Button
									onClick={handleSaveChanges}
									variant='secondary'
									disabled={isPending}
									type='submit'
								>
									{isPending ? (
										<Loader size={20} className='text-white animate-spin' />
									) : (
										'Save changes'
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			<Card className='mt-4 border-none shadow-none bg-amber-100'>
				<CardContent>
					<div className='flex flex-col mt-4'>
						<h3 className='font-bold mt-4'>Danger Zone</h3>
						<p className='text-sm text-muted-foreground'>
							Deleting a project is irreversible and will remove all associated
							data.
						</p>
						<Button
							type='button'
							variant='destructive'
							size='sm'
							className='mt-4 w-fit ml-auto p-4 text-sm'
							disabled={isDeletingProject}
							onClick={handleDelete}
						>
							{isDeletingProject ? (
								<Loader size={20} className='text-white animate-spin' />
							) : (
								'Delete Project'
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default UpdateProjectForm;