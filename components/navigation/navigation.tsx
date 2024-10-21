import Link from 'next/link';
import { routes } from './links';
import { cn } from '@/lib/utils';

function Navigation() {
	return (
		<ul className='flex flex-col'>
			{routes.map(({ label, href, icon, activeIcon }) => {
				const isActive = false;
				const Icon = isActive ? activeIcon : icon;
				return (
					<Link key={href} href={href}>
						<div
							className={cn(
								'flex items-center gap-2 p-2 rounded-lg font-medium hover:text-primary transition text-neutral-500',
								isActive && 'bg-white shadow-md hover:opacity-100 text-primary'
							)}
						>
							<Icon className='size-5 text-neutral-500' />
							{label}
						</div>
					</Link>
				);
			})}
		</ul>
	);
}
export default Navigation;
