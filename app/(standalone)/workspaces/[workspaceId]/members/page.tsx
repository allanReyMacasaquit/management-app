import MembersList from '@/appwrite/members/components/members-list';
import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

async function WorkspaceIdMembersPage() {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');

	return (
		<div className='w-full lg:max-w-2xl mt-5'>
			<MembersList />
		</div>
	);
}
export default WorkspaceIdMembersPage;
