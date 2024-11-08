import React from 'react';
import { useMedia } from 'react-use';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '../ui/dialog';
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerTitle,
} from '../ui/drawer';
import Image from 'next/image';

interface ResponsiveModalProps {
	children: React.ReactNode;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function ResponsiveModal({
	children,
	open,
	onOpenChange,
}: ResponsiveModalProps) {
	const isDesktop = useMedia('(min-width: 1080px)', true);

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className='w-full bg-gradient-to-t from-sky-600 lg:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]'>
					<DialogTitle className='px-6 mt-4'>
						<Image
							src='/assets/church-logo.svg'
							alt='Logo'
							width={50}
							height={50}
						/>
						<DialogDescription className=''>Workspace</DialogDescription>
					</DialogTitle>

					{children}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className='bg-gradient-to-t rounded-b-none-no from-sky-300'>
				<DrawerTitle className='mx-8'>
					<Image
						src='/assets/church-logo.svg'
						alt='Logo'
						width={50}
						height={50}
					/>
					<span>Workspace</span>
				</DrawerTitle>
				<DrawerDescription></DrawerDescription>
				<div className='overflow-y-auto hide-scrollbar max-h-[100vh]'>
					{children}
				</div>
			</DrawerContent>
		</Drawer>
	);
}

export default ResponsiveModal;
