import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { Task } from '../../types';
import { enUS } from 'date-fns/locale';
import {
	addMonths,
	format,
	getDay,
	parse,
	startOfWeek,
	subMonths,
} from 'date-fns';
import { useState } from 'react';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import EventCard from './event-card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const locales = {
	'en-US': enUS,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

interface DataCalendarProps {
	data: Task[];
}
interface CustomToolbarProps {
	date: Date;
	onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
}

const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
	return (
		<div className='flex mb-4 gap-x-1 lg:gap-x-2 bg-gradient-to-t from-purple-400 to via-violet-400 rounded-md items-center w-full lg:w-fit justify-center lg:justify-start'>
			<Button onClick={() => onNavigate('PREV')} variant='outline'>
				<ChevronLeftIcon className='size-5' />
				<p className='text-sm text-muted-foreground'>PREV</p>
			</Button>
			<div className='flex items-center border bg-violet-200 border-input rounded-md justify-center w-full lg:w-fit'>
				<CalendarIcon className='size-5 ml-1' />
				<p className='flex items-center text-center lg:w-28 lg:py-2 lg:justify-center text-xs'>
					{format(date, 'MMMM yyyy')}
				</p>
			</div>
			<Button onClick={() => onNavigate('NEXT')} variant='outline'>
				<p className='text-sm text-muted-foreground'>NEXT</p>
				<ChevronRightIcon className='size-5' />
			</Button>
		</div>
	);
};

function DataCalendar({ data }: DataCalendarProps) {
	const [value, setValue] = useState(
		data.length > 0 ? new Date(data[0].dueDate) : new Date()
	);

	const events = data.map((task) => ({
		start: new Date(task.dueDate),
		end: new Date(task.dueDate),
		title: task.name,
		project: task.project,
		assignee: task.assignee,
		status: task.status,
		$id: task.$id,
	}));

	const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
		if (action === 'PREV') {
			setValue(subMonths(value, 1));
		} else if (action === 'NEXT') {
			setValue(addMonths(value, 1));
		} else if (action === 'TODAY') {
			setValue(new Date());
		}
	};

	return (
		<div>
			<Calendar
				localizer={localizer}
				date={value}
				events={events}
				views={['month']}
				defaultView='month'
				toolbar
				showAllEvents
				className='h-full'
				max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
				formats={{
					weekdayFormat: (date, culture, localizer) =>
						localizer?.format(date, 'EEE', culture) ?? '',
				}}
				components={{
					event: ({ event }) => (
						<EventCard
							$id={event.$id}
							title={event.title}
							assignee={event.assignee}
							project={event.project}
							status={event.status}
						/>
					),
					toolbar: () => (
						<CustomToolbar date={value} onNavigate={handleNavigate} />
					),
				}}
			/>
		</div>
	);
}
export default DataCalendar;
