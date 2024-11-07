import { useParams } from 'next/navigation';

export function useTaskId(): string {
	const params = useParams();
	return params?.taskId as string;
}
