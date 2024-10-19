import { getCurrent } from '@/features/actions';
import SignUpCard from '@/features/components/sign-up-card';
import { redirect } from 'next/navigation';

async function SignUpPage() {
	const user = await getCurrent();
	if (user) redirect('/');
	return <SignUpCard />;
}
export default SignUpPage;
