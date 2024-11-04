'use client';

import { MenuIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer'; // Import Drawer components from ShadCN
import Sidebar from './sidebar';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useMedia } from 'react-use'; // Ensure you have this library installed: npm install react-use

function MobileSidebar() {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	const isDesktop = useMedia('(min-width: 1080px)', true);

	if (isDesktop) {
		return (
			<Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild>
					<Button className='lg:hidden'>
						<MenuIcon />
					</Button>
				</SheetTrigger>
				<SheetContent side='left' className='p-0'>
					<Sidebar />
				</SheetContent>
			</Sheet>
		);
	}

	// Mobile Mode: Render Drawer from ShadCN for smaller screens
	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
			<DrawerTrigger asChild>
				<Button variant='secondary' className='w-fit'>
					<MenuIcon />
				</Button>
			</DrawerTrigger>
			<DrawerContent className='p-0'>
				<Sidebar />
			</DrawerContent>
		</Drawer>
	);
}

export default MobileSidebar;
