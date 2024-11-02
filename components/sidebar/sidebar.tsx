import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import Navigation from '../navigation/navigation';
import WorkspaceSwitcher from '@/appwrite/workspaces/components/workspace-switcher';
import Projects from '@/appwrite/projects/components/projects';

function Sidebar() {
	return (
		<aside className='h-full bg-slate-300 p-4 w-full'>
			<Link href='/'>
				<Image
					src='/assets/church-logo.svg'
					alt='logo'
					height={50}
					width={50}
					priority
				/>
				<Separator className='mt-4' />
				<WorkspaceSwitcher />
				<Separator className='mt-4' />
			</Link>
			<Navigation />
			<Separator className='mt-4' />
			<Projects />
		</aside>
	);
}
export default Sidebar;
