'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useGetWorkspaces } from '../hooks/use-get-workspaces';
import { RiAddCircleFill } from 'react-icons/ri';
import WorkspaceAvatar from './workspace-avatar';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '../hooks/use-workspace-id';
import useCreateWorkspaceModal from '../hooks/use-create-workspace-modal';

function WorkspaceSwitcher() {
	const workspaceId = useWorkspaceId();
	const router = useRouter();
	const { data: workspaces } = useGetWorkspaces();
	const { open } = useCreateWorkspaceModal();

	const onSelect = (id: string) => {
		router.push(`/workspaces/${id}`);
	};

	return (
		<div className='flex flex-col'>
			<div className='flex items-center justify-between p-4 border rounded-xl mt-4'>
				{workspaces?.documents?.length === 1
					? 'Workspace'
					: workspaces?.documents.length || 0 > 1
					? 'Workspaces'
					: 'Create Workspace'}
				<RiAddCircleFill onClick={open} className='size-6 text-neutral-500  ' />
			</div>

			<div className='mt-2'>
				<Select onValueChange={onSelect} value={workspaceId}>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='No workspace selected' />
					</SelectTrigger>
					<SelectContent>
						{workspaces?.documents.map(({ $id, name, imageUrl }) => (
							<SelectItem key={$id} value={$id}>
								<div className='flex items-center justify-start gap-3 font font-medium'>
									<WorkspaceAvatar
										name={name}
										image={imageUrl}
										className='rounded-full'
									/>
									<p className='uppercase truncate'>{name}</p>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
export default WorkspaceSwitcher;
