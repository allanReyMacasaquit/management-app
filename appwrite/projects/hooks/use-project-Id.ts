import { useParams } from 'next/navigation';

export function useProjectId(): string {
	const params = useParams();
	return params?.ProjectId as string;
}
