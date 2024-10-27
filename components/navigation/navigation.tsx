'use client';

import Link from 'next/link';
import { routes } from './links';
import { cn } from '@/lib/utils';
import { useWorkspaceId } from '@/appwrite/workspaces/hooks/use-workspace-id';
import { usePathname } from 'next/navigation';

function Navigation() {
	const workspaceId = useWorkspaceId();
	const pathname = usePathname();
	return (
		<div className='flex flex-col mt-4'>
			{routes.map(({ label, href, icon, activeIcon }) => {
				const fullHref = `/workspaces/${workspaceId}${href}`;
				const isActive = pathname === fullHref;
				const Icon = isActive ? activeIcon : icon;
				return (
					<Link key={href} href={fullHref}>
						<div
							className={cn(
								'flex items-center gap-2 p-2 rounded-lg font-medium hover:text-primary transition text-neutral-500',
								isActive && 'bg-blue-300  hover:bg-blue-300/70 text-primary'
							)}
						>
							<Icon className='size-5 text-neutral-500' />
							{label}
						</div>
					</Link>
				);
			})}
		</div>
	);
}
export default Navigation;
