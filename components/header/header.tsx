import Image from 'next/image';
import { Button } from '../ui/button';

function Header() {
	return (
		<nav className='flex items-center mx-auto max-w-7xl p-2 justify-between gap-2'>
			<Image
				src='assets/church-logo.svg'
				alt='church logo'
				height={50}
				width={50}
				priority
			/>
			<Button variant='primary' size='sm' className='w-28'>
				Login
			</Button>
		</nav>
	);
}
export default Header;
