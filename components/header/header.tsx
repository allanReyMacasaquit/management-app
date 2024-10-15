import Image from 'next/image';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

function Header() {
	const pathname = usePathname();
	const isSignIn = pathname === '/sign-in';

	return (
		<nav className='flex items-center mx-auto max-w-7xl p-2 justify-between gap-2'>
			<Image
				src='/assets/church-logo.svg'
				alt='church logo'
				height={50}
				width={50}
				priority
			/>
			{/* Use Link to wrap the Button for better accessibility */}
			<Link href={isSignIn ? '/sign-up' : '/sign-in'}>
				<Button variant='primary' size='sm' className='w-28'>
					{isSignIn ? 'Sign Up' : 'Log In'}
				</Button>
			</Link>
		</nav>
	);
}

export default Header;
