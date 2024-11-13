import { cn } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';
import {
	AlertCircle,
	CheckCircle2,
	InfoIcon,
	MessageCircleWarningIcon,
} from 'lucide-react';

interface TaskDateProps {
	value: string;
	className?: string;
}

function TaskDate({ value, className }: TaskDateProps) {
	const today = new Date();
	const endDate = new Date(value);
	const diffInDays = differenceInDays(endDate, today);

	// Set textColor class based on the days difference
	let textColor =
		'text-green-500 hover:bg-green-200 bg-green-50 w-[320px] lg:w-full rounded-lg p-2';

	if (diffInDays <= 3) {
		textColor =
			'text-red-500 bg-red-50 w-[320px] w-full lg:w-full hover:bg-red-200 rounded-lg p-2';
	} else if (diffInDays <= 7) {
		textColor =
			'text-orange-500 bg-orange-50 w-[320px] lg:w-full hover:bg-orange-200 rounded-lg p-2';
	} else if (diffInDays <= 14) {
		textColor =
			'text-yellow-500 bg-yellow-50 w-[320px] lg:w-full hover:bg-yellow-200 rounded-lg p-2';
	}

	return (
		<div className={cn(textColor, className)}>
			<span className='truncate flex items-center tracking-widest'>
				{diffInDays <= 3 ? (
					<AlertCircle className='mr-2' />
				) : diffInDays <= 7 ? (
					<MessageCircleWarningIcon className='mr-2' />
				) : diffInDays <= 14 ? (
					<InfoIcon className='mr-2' />
				) : (
					<CheckCircle2 className='mr-2' />
				)}
				{format(endDate, 'PPP')}
			</span>
		</div>
	);
}

export default TaskDate;
