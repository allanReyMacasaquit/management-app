'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProjectAvatarProps {
	name: string;
	image?: string;
	className?: string;
	fallbackClassName?: string;
}

function ProjectAvatar({
	image,
	name,
	className,
	fallbackClassName,
}: ProjectAvatarProps) {
	if (image) {
		return (
			<div
				className={cn(
					'relative rounded-full flex items-center overflow-hidden',
					className
				)}
			>
				<Image
					src={image}
					alt={name}
					width={100}
					height={100}
					className='object-cover rounded-full border-2 bg-gradient-to-t from-blue-500 to-slate-800 border-gray-300' // Ensure the image is also rounded
				/>
			</div>
		);
	}

	return (
		<div
			className={cn(
				'flex items-center rounded-full shadow shadow-blue-300',
				fallbackClassName
			)}
		>
			<div className='w-10 h-10 rounded-full border-2 bg-gradient-to-t from-blue-500 to-slate-800 border-gray-300 flex items-center justify-center'>
				<span className='text-2xl capitalize text-white'>{name.charAt(0)}</span>{' '}
			</div>
		</div>
	);
}

export default ProjectAvatar;
