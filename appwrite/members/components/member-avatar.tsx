'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MemberAvatarProps {
	name: string;
	fallbackClassName?: string;
	className?: string;
}

function MemberAvatar({
	name,
	fallbackClassName,
	className,
}: MemberAvatarProps) {
	return (
		<Avatar
			className={cn(
				'transition border border-neutral-300 rounded-full ',
				className
			)}
		>
			<AvatarFallback
				className={cn(
					' bg-gradient-to-t from-blue-400 to-purple-300  font-medium  text-2xl',
					fallbackClassName
				)}
			>
				{name.charAt(0).toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
}
export default MemberAvatar;
