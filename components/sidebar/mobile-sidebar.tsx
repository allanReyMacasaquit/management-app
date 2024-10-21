'use client';

import { MenuIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import Sidebar from './sidebar';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function MobileSidebar() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	return (
		<Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant='secondary' size='icon' className='lg:hidden'>
					<MenuIcon />
				</Button>
			</SheetTrigger>
			<SheetContent side='left' className='p-0'>
				<Sidebar />
			</SheetContent>
		</Sheet>
	);
}
export default MobileSidebar;
