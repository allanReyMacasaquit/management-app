'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import DottedSeparator from '@/features/components/dotted-separator';
import Link from 'next/link';
import { useJoinWorkspace } from '../hooks/use-join-workspace';
import { useInviteCode } from '../hooks/use-invite-code';
import { useWorkspaceId } from '../hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import Image from 'next/image';

interface JoinWorkspaceFormProps {
	initialValues: string;
}

function JoinWorkspaceForm({ initialValues }: JoinWorkspaceFormProps) {
	const { mutate, isPending } = useJoinWorkspace();
	const inviteCode = useInviteCode();
	const workspaceId = useWorkspaceId();
	const router = useRouter();

	const onSubmit = () => {
		if (!workspaceId || !inviteCode) {
			console.log('Workspace ID or invite code is missing.');
			return;
		}

		mutate(
			{
				param: { workspaceId },
				json: { code: inviteCode },
			},
			{
				onSuccess: ({ data }) => {
					router.push(`/workspaces/${data.$id}`);
				},
			}
		);
	};

	return (
		<Card className='w-full h-full border-none shadow-none mt-10'>
			<CardHeader>
				<CardTitle className='text-2xl'>
					<Image
						src='/assets/church-logo.svg'
						alt='Logo'
						width={50}
						height={50}
					/>
				</CardTitle>
				<CardTitle>Join Workspace</CardTitle>
			</CardHeader>
			<DottedSeparator />
			<CardDescription className='m-6 '>
				You&apos;ve been invited to join <strong>{initialValues}</strong>{' '}
				workspace
			</CardDescription>
			<DottedSeparator />
			<CardContent>
				<div className=' mt-8 flex flex-col lg:flex-row justify-between items-center gap-2'>
					<Link href='/' className='w-full'>
						<Button
							disabled={isPending}
							type='button'
							variant='outline'
							className='lg:w-fit'
						>
							Cancel
						</Button>
					</Link>
					<Button
						disabled={isPending}
						onClick={onSubmit}
						type='button'
						variant='secondary'
						className='w-full'
					>
						{isPending ? <Loader className='animate-spin' /> : 'Join Workspace'}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}

export default JoinWorkspaceForm;
