import UserButton from '@/components/user/user-button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface StandaloneLayoutProps {
	children: React.ReactNode;
}

function StandaloneLayout({ children }: StandaloneLayoutProps) {
	return (
		<main className='min-h-screen bg-slate-200'>
			<div className='mx-auto max-w-screen-2xl p-4'>
				<nav className='flex justify-between items-center h-16'>
					<Link href='/'>
						<Image
							src='/assets/church-logo.svg'
							alt='logo'
							height={50}
							width={50}
						/>
					</Link>
					<UserButton />
				</nav>
				<div className='flex flex-col items-center py-4'>{children}</div>
			</div>
		</main>
	);
}
export default StandaloneLayout;
