'use client';

import ResponsiveModal from '@/components/modals/responsive-modal';
import CreateWorkspaceForm from './create-workspace-form';
import useCreateWorkspaceModal from '../hooks/use-create-workspace-modal';

function CreateWorkspaceModal() {
	const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();
	return (
		<ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
			<CreateWorkspaceForm onCancel={close} />
		</ResponsiveModal>
	);
}
export default CreateWorkspaceModal;
