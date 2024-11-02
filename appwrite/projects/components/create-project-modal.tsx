'use client';

import ResponsiveModal from '@/components/modals/responsive-modal';
import useCreateProjectsModal from '../hooks/use-create-projects-modal';
import CreateProjectForm from './create-project-form';

function CreateProjectModal() {
	const { isOpen, setIsOpen, close } = useCreateProjectsModal();
	return (
		<ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
			<CreateProjectForm onCancel={close} />
		</ResponsiveModal>
	);
}
export default CreateProjectModal;
