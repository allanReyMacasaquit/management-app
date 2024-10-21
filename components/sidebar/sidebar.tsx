import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '../ui/separator';
import Navigation from '../navigation/navigation';

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
				<Navigation />
			</Link>
		</aside>
	);
}
export default Sidebar;
