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
import { ImageIcon, Loader } from 'lucide-react';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';

interface CreateWorkspaceFormProps {
	onCancel?: () => void;
}

function CreateWorkspaceForm({ onCancel }: CreateWorkspaceFormProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { mutate, isPending } = useWorkspaces();
	const form = useForm<z.infer<typeof workspacesSchema>>({
		resolver: zodResolver(workspacesSchema),
		defaultValues: {
			name: '',
		},
	});

	// State to manage the image file and its preview
	const [imageFile, setImageFile] = useState<File | undefined>(undefined);
	const [imagePreview, setImagePreview] = useState<string | undefined>(
		undefined
	);

	// Submit handler for the form
	const onSubmit = async (values: z.infer<typeof workspacesSchema>) => {
		// Prepare the final form values
		const finalValues = {
			...values,
			image: imageFile, // Send the image file to the backend
		};

		// Call the mutate function to trigger the upload
		mutate({ form: finalValues });
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file)); // Create a preview for the selected image
		}
	};

	return (
		<Card className='w-full h-full'>
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
						<DottedSeparator />
						{/* Remove the unused field from image input */}
						<div className='size-64 relative rounded-md overflow-hidden py-4'>
							<div className='flex flex-col gap-y-2'>
								<div className='flex items-center gap-x-5'>
									{imagePreview ? (
										<div>
											<Image
												src={imagePreview}
												alt='image'
												fill
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
										<p className='text-xs text-muted-foreground'>
											JPG, PNG, SVG, or JPEG, Max 1MB.
										</p>
										<input
											type='file'
											accept='.jpeg, .png, .svg, .jpg'
											className='hidden'
											ref={inputRef}
											disabled={isPending}
											onChange={handleImageChange}
										/>
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
									</div>
								</div>
							</div>
						</div>
						<div className='flex items-center justify-between space-x-2'>
							<Button
								variant='secondary'
								disabled={isPending}
								type='submit'
								className='mt-4'
							>
								{isPending ? (
									<Loader size={20} className='text-white animate-spin' />
								) : (
									'Create Workspace'
								)}
							</Button>
							<Button
								disabled={isPending}
								type='button'
								variant='destructive'
								onClick={onCancel}
								className='mt-4'
							>
								{isPending ? (
									<Loader size={20} className='text-white animate-spin' />
								) : (
									'Cancel'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}

export default CreateWorkspaceForm;
