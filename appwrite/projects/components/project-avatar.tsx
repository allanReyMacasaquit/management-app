'use client';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { AvatarIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

interface ProjectAvatarProps {
	name: string;
	image?: string;
	className?: string;
}

function ProjectAvatar({ image, className }: ProjectAvatarProps) {
	if (image) {
		return (
			<div
				className={cn(
					' size-8 relative rounded-full flex items-center overflow-hidden',
					className
				)}
			>
				<div>
					<Image
						src={image}
						alt='avatar'
						width={100}
						height={100}
						className='object-cover'
					/>
				</div>
			</div>
		);
	}

	return (
		<Avatar className='rounded-full'>
			<AvatarIcon className='scale-100 w-full h-full text-blue-600'></AvatarIcon>
		</Avatar>
	);
}
export default ProjectAvatar;
