'use client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MemberAvatarProps {
	name: string;
	fallbackClassName?: string;
	className?: string;
}

function NameAvatar({ name, fallbackClassName, className }: MemberAvatarProps) {
	return (
		<Avatar
			className={cn(
				'transition border border-neutral-500 rounded-full ',
				className
			)}
		>
			<AvatarFallback
				className={cn(
					' bg-gradient-to-t from-slate-100 font-medium  text-2xl',
					fallbackClassName
				)}
			>
				{name.charAt(0).toUpperCase()}
			</AvatarFallback>
		</Avatar>
	);
}
export default NameAvatar;
