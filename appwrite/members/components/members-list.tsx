'use client';

import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DottedSeparator from '@/features/components/dotted-separator';
import { ArrowLeftIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useGetMembers } from '../hooks/use-get-member';
import MemberAvatar from './member-avatar';
import { Separator } from '@/components/ui/separator';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useDeleteMember } from '../hooks/use-delete-member';
import { useUpdateMember } from '../hooks/use-update-member';
import { Role } from '../types';
import { useConfirm } from '@/components/user/use-confirm';
import { toast } from 'sonner';
import { useWarning } from '@/components/user/use-warning';

function MembersList() {
	const workspaceId = useWorkspaceId();
	const { data } = useGetMembers({ workspaceId });

	const { mutate: deleteMember, isPending: isDeletingMember } =
		useDeleteMember();
	const { mutate: updateMember, isPending: isUpdatingMember } =
		useUpdateMember();

	const [RemoveConfirmDialog, confirmRemove] = useConfirm(
		'Remove member',
		'This member will be removed from the workspace',
		'destructive'
	);

	const [LastMemberDialog, confirmLastMember] = useWarning(
		'Oppss...',
		'You cannot delete the last member of the workspace'
	);

	const handleUpdateMember = (memberId: string, role: Role) => {
		updateMember({
			json: { role },
			param: { memberId },
		});
	};

	const handleDeleteMember = async (memberId: string) => {
		// If only one member remains, trigger the last member warning
		if (data?.documents.length === 1) {
			await confirmLastMember();
			return;
		}

		// Otherwise, proceed with the standard delete confirmation
		const confirmed = await confirmRemove();
		if (!confirmed) return;

		deleteMember(
			{ param: { memberId } },
			{
				onSuccess: () => {
					toast.success('Member deleted successfully');
					window.location.reload();
				},
			}
		);
	};

	return (
		<Card>
			<RemoveConfirmDialog />
			<LastMemberDialog />
			<CardHeader className='flex gap-x-4 p-7 space-y-0'>
				<div className='flex flex-row items-center justify-between'>
					<Link href={`/workspaces/${workspaceId}`}>
						<Button variant='outline'>
							<ArrowLeftIcon />
							Back
						</Button>
					</Link>
					<CardTitle className='text-xl font-bold lg:mr-20 uppercase'>
						Members list
					</CardTitle>
					<div></div>
				</div>
			</CardHeader>
			<div className='w-[300px] lg:w-[250px] mx-auto'>
				<DottedSeparator />
			</div>

			<CardContent className='space-y-4'>
				{data?.documents.map((member, index) => (
					<div key={index}>
						<div className='flex items-center justify-between'>
							<div className='flex items-center'>
								<MemberAvatar name={member.name} />
								<div className='mx-2 sm:p-4 truncate w-[220px] sm:w-full'>
									<p className='font-medium capitalize'>{member.name}</p>
									<p className='text-sm text-muted-foreground'>
										{member.email}
									</p>
								</div>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button className='items-center' size='icon' variant='ghost'>
										<MoreVerticalIcon className='size-5 text-muted-foreground' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent side='bottom' align='end' className='p-4'>
									<DropdownMenuItem
										className='cursor-pointer outline-none hover:bg-slate-100 p-2 rounded-md'
										onClick={() => handleUpdateMember(member.$id, Role.admin)}
										disabled={isUpdatingMember}
									>
										Set as <strong className='uppercase'>Administrator</strong>
									</DropdownMenuItem>
									<Separator />
									<DropdownMenuItem
										className='cursor-pointer outline-none hover:bg-slate-100 p-2 rounded-md'
										onClick={() => handleUpdateMember(member.$id, Role.members)}
										disabled={isUpdatingMember}
									>
										Set as Member
									</DropdownMenuItem>
									<DropdownMenuItem
										className='justify-between flex cursor-pointer outline-none hover:bg-slate-100 p-2 rounded-md'
										onClick={() => handleDeleteMember(member.$id)}
										disabled={isDeletingMember}
									>
										<span className='capitalize'>{member.name}</span>
										<Trash2Icon className='text-red-500' />
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						{index < data.documents.length - 1 && <Separator />}
					</div>
				))}
			</CardContent>
		</Card>
	);
}

export default MembersList;
