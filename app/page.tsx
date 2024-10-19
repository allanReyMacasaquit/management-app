import UserButton from '@/components/user/user-button';
import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

async function HomePage() {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');

	return (
		<div>
			<UserButton />
		</div>
	);
}
export default HomePage;
