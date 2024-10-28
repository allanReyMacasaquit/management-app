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
				<DialogContent className='w-full lg:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]'>
					<DialogTitle className='p-2 '>Workspace</DialogTitle>
					<DialogDescription className='hidden'>
						&apos;Enter your team name and upload an image to create your
						workspace&apos;.
					</DialogDescription>
					{children}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerTitle className='px-2'>Workspace</DrawerTitle>
				<DrawerDescription className='hidden'>
					&apos;Enter your team name and upload an image to create your
					workspace&apos;.
				</DrawerDescription>
				<div className='overflow-y-auto hide-scrollbar max-h-[85vh]'>
					{children}
				</div>
			</DrawerContent>
		</Drawer>
	);
}

export default ResponsiveModal;
