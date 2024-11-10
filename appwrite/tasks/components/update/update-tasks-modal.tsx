'use client';

import ResponsiveModal from '@/components/modals/responsive-modal';
import useUpdateTasksModal from '../../hooks/use-update-tasks-modal';
import UpdateTasksFormWrapper from './update-tasks-form-wrapper';

function UpdateTasksModal() {
	const { taskId, close } = useUpdateTasksModal();
	return (
		<ResponsiveModal open={!!taskId} onOpenChange={close}>
			{taskId && <UpdateTasksFormWrapper id={taskId} onCancel={close} />}
		</ResponsiveModal>
	);
}
export default UpdateTasksModal;
