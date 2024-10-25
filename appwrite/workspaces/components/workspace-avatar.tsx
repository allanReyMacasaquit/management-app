'use client';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AvatarIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

interface WorkspaceAvatarProps {
	name: string;
	image?: string;
	className?: string;
}

function WorkspaceAvatar({ name, image, className }: WorkspaceAvatarProps) {
	if (image) {
		return (
			<div
				className={cn(
					'size-10 relative flex items-center rounded-lg overflow-hidden',
					className
				)}
			>
				<Image
					src={image}
					alt='avatar'
					width={100}
					height={100}
					className='object-cover'
				/>
			</div>
		);
	}

	return (
		<Avatar className='w-17 rounded-full p-1'>
			<AvatarIcon className='scale-100 w-full h-full text-blue-600'></AvatarIcon>
			<span className='uppercase items-center'>{name[0]}</span>
		</Avatar>
	);
}
export default WorkspaceAvatar;
