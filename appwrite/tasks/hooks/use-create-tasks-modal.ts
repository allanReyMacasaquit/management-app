'use client';
import { parseAsBoolean, useQueryState } from 'nuqs';

function useCreateTasksModal() {
	const [isOpen, setIsOpen] = useQueryState(
		'create-task',
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
export default useCreateTasksModal;
