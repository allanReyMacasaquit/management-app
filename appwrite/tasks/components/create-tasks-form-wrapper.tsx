import { useGetMembers } from '@/appwrite/members/hooks/use-get-member';
import CreateProjectForm from '@/appwrite/projects/components/create-project-form';
import { useGetProjects } from '@/appwrite/projects/hooks/use-get-projects';
import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2Icon } from 'lucide-react';
import CreateTaskForm from './create-tasks-form';

interface CreateTasksFormWrapperProps {
	onCancel: () => void;
}

function CreateTasksFormWrapper({ onCancel }: CreateTasksFormWrapperProps) {
	const workspaceId = useWorkspaceId();
	const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
		workspaceId,
	});
	const { data: members, isLoading: isLoadingMembers } = useGetMembers({
		workspaceId,
	});

	const projectOptions = projects?.documents.map((project) => ({
		id: project.$id,
		name: project.name,
		imageUrl: project.imageUrl,
	}));

	const memberOptions = members?.documents.map((member) => ({
		id: member.$id,
		name: member.name,
	}));

	const isLoading = isLoadingProjects || isLoadingMembers;

	if (isLoading) {
		return (
			<Card className='w-full min-h-96'>
				<CardContent className=' h-full flex items-center justify-center'>
					<Loader2Icon className='size-6 animate-spin text-muted-foreground' />
				</CardContent>
			</Card>
		);
	}

	return (
		<CreateTaskForm
			onCancel={onCancel}
			projectOptions={projectOptions ?? []}
			memberOptions={memberOptions ?? []}
		/>
	);
}
export default CreateTasksFormWrapper;
