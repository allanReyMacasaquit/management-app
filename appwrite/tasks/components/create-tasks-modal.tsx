'use client';

import ResponsiveModal from '@/components/modals/responsive-modal';

import useCreateTasksModal from '../hooks/use-create-tasks-modal';
import CreateTasksFormWrapper from './create-tasks-form-wrapper';

function CreateTasksModal() {
	const { isOpen, setIsOpen, close } = useCreateTasksModal();
	return (
		<ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
			<CreateTasksFormWrapper onCancel={close} />
		</ResponsiveModal>
	);
}
export default CreateTasksModal;
