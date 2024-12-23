'use client';

import { useCurrent } from '@/hooks/use-current';
import { Loader, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import DottedSeparator from '@/features/components/dotted-separator';
import { useLogout } from '@/hooks/use-logout';

function UserButton() {
	const { data: user, isLoading } = useCurrent();
	const { mutate: logout, isPending } = useLogout();

	if (isLoading) {
		return (
			<div
				className='
                size-10 
                rounded-full 
                flex 
                items-center 
                justify-center
                bg-neutral-200
                border
                border-neutral-300
                '
			>
				<Loader className='size-4 animate-spin text-muted-foreground' />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	const { name, email } = user;
	const avatarFallback = name
		? name.charAt(0).toUpperCase()
		: email.charAt(0) ?? '';
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className='outline-none relative'>
				<Avatar className='size-10 hover:opacity-75 transition border border-neutral-300'>
					<AvatarFallback className='bg-slate-200 font-medium text-neutral-500 flex items-center justify-center'>
						{avatarFallback}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align='end'
				side='bottom'
				sideOffset={10}
				className='w-60 bg-slate-100'
			>
				<div className='flex flex-col items-center justify-center gap-2 px-2.5 py-4'>
					<Avatar className='size-12 hover:opacity-75 transition border border-neutral-300'>
						<AvatarFallback className='bg-neutral-200 text-xl font-medium text-neutral-500 flex items-center justify-center'>
							{avatarFallback}
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col items-center justify-center'>
						<p className='text-sm font-medium text-neutral-900'>
							{name || 'User'}
						</p>
						<p className='text-xs text-neutral-500'>{email}</p>
					</div>
				</div>
				<DottedSeparator />
				<DropdownMenuItem
					onClick={() => logout()}
					className='h-10 flex items-center justify-center text-amber-700 font-medium cursor-pointer'
				>
					<LogOut className='size-4 mr-2' />
					{isPending ? <Loader className='size-4 animate-spin' /> : 'Log out'}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
export default UserButton;
