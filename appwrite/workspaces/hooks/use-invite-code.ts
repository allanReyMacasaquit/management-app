import { useParams } from 'next/navigation';

export function useInviteCode(): string {
	const params = useParams();
	return params?.inviteCode as string;
}
