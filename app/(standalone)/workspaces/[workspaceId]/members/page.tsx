import MembersList from '@/appwrite/members/components/members-list';
import { getCurrent } from '@/features/actions';
import { redirect } from 'next/navigation';

async function WorkspaceIdMembersPage() {
	const user = getCurrent();
	if (!user) redirect('/sign-in');

	return (
		<div className='w-full lg:max-w-4xl'>
			<MembersList />
		</div>
	);
}
export default WorkspaceIdMembersPage;
