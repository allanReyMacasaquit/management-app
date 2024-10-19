'use client';

import { Button } from '@/components/ui/button';
import { useCurrent } from '@/hooks/use-current';
import { useLogout } from '@/hooks/use-logout';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function HomePage() {
	const { data, isLoading } = useCurrent();
	const { mutate } = useLogout();
	const router = useRouter();

	useEffect(() => {
		if (!data && !isLoading) {
			router.push('/sign-in');
		}
	}, [data, isLoading, router]);

	return (
		<div>
			Only visible to authorized users.
			<Button variant='primary' onClick={() => mutate()}>
				Log out
			</Button>
		</div>
	);
}
export default HomePage;
