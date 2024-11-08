'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface DatePickerProps {
	value: Date | undefined;
	onChange: (date: Date) => void;
	className?: string;
	placeholder?: string;
}
import React from 'react';

// Adjust your DatePicker definition
const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
	({ value, onChange, className, placeholder = 'Select Date' }, ref) => {
		return (
			<Popover>
				<PopoverTrigger asChild>
					<Button
						ref={ref} // Pass ref here
						variant='outline'
						className={cn(
							'w-full justify-start mt-4 text-left font-normal px-3',
							!value && 'text-muted-foreground',
							className
						)}
					>
						<CalendarIcon className='mr-2 h-5 w-5 text-blue-600' />
						{value ? format(value, 'PPP') : <span>{placeholder}</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0'>
					<Calendar
						mode='single'
						selected={value}
						onSelect={(date) => onChange(date as Date)}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
		);
	}
);
DatePicker.displayName = 'DatePicker';

export default DatePicker;
