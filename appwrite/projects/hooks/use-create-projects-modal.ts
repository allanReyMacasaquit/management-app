'use client';
import { parseAsBoolean, useQueryState } from 'nuqs';

function useCreateProjectsModal() {
	const [isOpen, setIsOpen] = useQueryState(
		'create-project',
		parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
	);
	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	return {
		isOpen,
		open,
		close,
		setIsOpen,
	};
}
export default useCreateProjectsModal;
