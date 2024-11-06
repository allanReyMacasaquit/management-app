'use client';
import { Loader } from 'lucide-react';

function DashboardLoading() {
	return (
		<div className='min-h-96 flex items-center justify-center'>
			<Loader className='size-10 animate-spin text-muted-foreground' />
		</div>
	);
}
export default DashboardLoading;
