import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon } from 'lucide-react';

function TaskViewSwitcher() {
	return (
		<Tabs className='w-full flex-1 border rounded-lg'>
			<div className='h-full flex flex-col overflow-auto p-4'>
				<div className='flex flex-col gap-y-2 lg:flex-row justify-between'>
					<TabsList className='w-full lg:w-auto'>
						<TabsTrigger value='table' className='w-full h-8 lg:w-auto'>
							Table
						</TabsTrigger>
						<TabsTrigger value='kanban' className='w-full h-8 lg:w-auto'>
							Kanban
						</TabsTrigger>
						<TabsTrigger value='calendar' className='w-full h-8 lg:w-auto'>
							Calendar
						</TabsTrigger>
					</TabsList>
					<Button variant='primary' size='sm' className='lg:w-fit rounded-full'>
						<PlusIcon className='size-5 ' />
						New
					</Button>
				</div>
				<Separator className='bg-white my-4' />
				Data filters
				<Separator className='bg-white my-4' />
				<TabsContent value='table'>Data table</TabsContent>
				<TabsContent value='kanban'>Data kanban</TabsContent>
				<TabsContent value='calendar'>Data calendar</TabsContent>
			</div>
		</Tabs>
	);
}
export default TaskViewSwitcher;
