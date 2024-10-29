import { useParams } from 'next/navigation';

export function useWorkspaceId(): string | undefined {
	const params = useParams();
	return params?.workspaceId as string | undefined;
}
