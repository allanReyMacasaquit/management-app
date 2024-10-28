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
import { updateWorkspacesSchema } from '../schemas';
import { Workspace } from '../types';
import { useUpdateWorkspaces } from '../hooks/use-update-workspaces';
import { useConfirm } from '@/components/user/use-confirm';
import { useDeleteWorkspaces } from '../hooks/use-delete-workspaces';

interface EditWorkspaceFormProps {
	onCancel?: () => void;
	initialValues: Workspace;
}

function EditWorkspaceForm({
	onCancel,
	initialValues,
}: EditWorkspaceFormProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { mutate, isPending } = useUpdateWorkspaces();

	const [DeleteDialog, confirmDelete] = useConfirm(
		'Delete Workspace',
		'The action cannot be undone',
		'destructive'
	);

	const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
		useDeleteWorkspaces();

	const form = useForm<z.infer<typeof updateWorkspacesSchema>>({
		resolver: zodResolver(updateWorkspacesSchema),
		defaultValues: {
			...initialValues,
			image: initialValues.imageUrl ?? '',
		},
	});

	const router = useRouter();

	// State to manage the image file and its preview
	const [imageFile, setImageFile] = useState<File | undefined>(undefined);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	// Submit handler for the form
	const onSubmit = async (values: z.infer<typeof updateWorkspacesSchema>) => {
		// Prepare the final form values
		const finalValues = {
			...values,
			image: imageFile, // Send the image file to the backend
		};

		// Call the mutate function to trigger the upload
		mutate(
			{ form: finalValues, param: { workspaceId: initialValues.$id } },

			{
				onSuccess: ({ data }) => {
					form.reset();
					router.push(`/workspaces/${data.$id}`);
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
		deleteWorkspace(
			{
				param: { workspaceId: initialValues.$id },
			},
			{
				onSuccess: () => {
					router.push('/');
				},
				onError: (error) => {
					// Handle error
					console.error('Error deleting workspace:', error);
					alert('Failed to delete workspace. Please try again.');
				},
			}
		);
	};

	return (
		<div>
			<DeleteDialog />
			<Card>
				<CardHeader className='flex flex-row items-center gap-x-4 justify-between '>
					<Button
						onClick={
							onCancel
								? onCancel
								: () => router.push(`/workspaces/${initialValues.$id}`)
						}
						variant='outline'
					>
						<ArrowLeftIcon size={14} />
						Back
					</Button>
					<CardTitle className='text-2xl'>{initialValues.name}</CardTitle>
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
											<Input
												{...field}
												placeholder='Enter workspace name'
												className='mb-4'
											/>
										</FormControl>
										{/* Show error message if validation fails */}
										{fieldState.error && (
											<FormMessage>{fieldState.error.message}</FormMessage>
										)}
									</FormItem>
								)}
							/>

							{/* Image upload section */}
							<div className='size-64 relative rounded-md overflow-hidden py-4'>
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
										<div className='flex flex-col px-8'>
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
							<div className='flex items-center justify-between space-x-2 mt-4'>
								<Button variant='secondary' disabled={isPending} type='submit'>
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
			<Card className='mt-4'>
				<CardContent>
					<div className='flex flex-col mt-4'>
						<h3 className='font-bold'>Danger Zone</h3>
						<p className='text-sm text-muted-foreground'>
							Deleting a workspace is irreversible and will remove all
							associated data.
						</p>
						<Button
							type='button'
							variant='destructive'
							size='sm'
							className='mt-4 w-fit ml-auto'
							disabled={isPending || isDeletingWorkspace}
							onClick={handleDelete}
						>
							Delete Workspace
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default EditWorkspaceForm;
