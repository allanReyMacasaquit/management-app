import { useParams } from 'next/navigation';

export function useWorkspaceId(): string {
	const params = useParams();
	return params?.workspaceId as string;
}
