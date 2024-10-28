import { useState } from 'react';
import { Button, ButtonProps } from '../ui/button';
import ResponsiveModal from '../modals/responsive-modal';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';

export const useConfirm = (
	title: string,
	message: string,
	variant: ButtonProps['variant'] = 'primary'
): [() => JSX.Element, () => Promise<boolean>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void | null;
	} | null>(null);

	const confirm = () => {
		return new Promise<boolean>((resolve) => {
			setPromise({ resolve });
		});
	};

	const handleClose = () => {
		setPromise(null);
	};

	const handleConfirm = () => {
		promise?.resolve(true);
		handleClose();
	};

	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};

	const ConfirmationDialog = () => (
		<ResponsiveModal open={!!promise} onOpenChange={handleClose}>
			<Card className=''>
				<CardContent className=''>
					<CardHeader>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{message}</CardDescription>
					</CardHeader>
					<div className='pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center'>
						<Button
							onClick={handleCancel}
							variant='outline'
							className='w-full lg:w-auto'
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirm}
							variant={variant}
							className='w-full lg:w-auto'
						>
							Confirm
						</Button>
					</div>
				</CardContent>
			</Card>
		</ResponsiveModal>
	);

	return [ConfirmationDialog, confirm];
};
