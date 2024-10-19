import { getCurrent } from '@/features/actions';
import SignInCard from '@/features/components/sign-in-card';
import { redirect } from 'next/navigation';

async function SignInPage() {
	const user = await getCurrent();
	if (user) redirect('/');
	return <SignInCard />;
}
export default SignInPage;
