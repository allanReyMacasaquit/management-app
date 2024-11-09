import { Badge } from '@/components/ui/badge';
import {
	ClipboardList,
	RefreshCw,
	CheckCircle,
	Eye,
	Archive,
} from 'lucide-react';

interface StatusBadgeProps {
	status: string;
}

function StatusBadge({ status }: StatusBadgeProps) {
	let icon = null;
	let bgColor = 'bg-slate-500';

	// Determine icon and color based on status
	switch (status) {
		case 'TODO':
			icon = <ClipboardList className='text-purple-500 mr-2' />;
			bgColor = 'bg-purple-100 hover:bg-purple-200 text-purple-600';
			break;
		case 'IN_PROGRESS':
			icon = <RefreshCw className='text-blue-500 mr-2' />;
			bgColor = 'bg-blue-100 hover:bg-blue-200 text-blue-600';
			break;
		case 'DONE':
			icon = <CheckCircle className='text-green-500 mr-2' />;
			bgColor = 'bg-green-100 hover:bg-green-200 text-green-600';
			break;
		case 'IN_REVIEW':
			icon = <Eye className='text-orange-500 mr-2' />;
			bgColor = 'bg-orange-100 hover:bg-orange-200 text-orange-600';
			break;
		case 'BACKLOG':
			icon = <Archive className='text-red-500 mr-2' />;
			bgColor = 'bg-red-100 hover:bg-red-200 text-red-600';
			break;
		default:
			icon = null;
			bgColor = 'bg-slate-500 text-white';
	}

	return (
		<Badge className={`flex items-center w-full ${bgColor} p-2 rounded-lg `}>
			{icon}
			{status}
		</Badge>
	);
}

export default StatusBadge;
