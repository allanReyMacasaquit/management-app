'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangleIcon } from 'lucide-react';
import Link from 'next/link';
import { GoArrowLeft } from 'react-icons/go';

function ErrorPage() {
	return (
		<div className='min-h-96  flex flex-col gap-y-2 items-center justify-center'>
			<AlertTriangleIcon className='size-10 text-red-600' />
			<p className='text-lg'>Something went wrong!</p>
			<div className='flex'>
				<Link href='/'>
					<Button variant='outline' className='w-fit bg-slate-200'>
						<GoArrowLeft className='mr-2 size-7' />

						<span>Back to home</span>
					</Button>
				</Link>
			</div>
		</div>
	);
}
export default ErrorPage;
