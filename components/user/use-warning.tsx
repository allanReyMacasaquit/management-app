import { useState } from 'react';
import { Button } from '../ui/button';
import ResponsiveModal from '../modals/responsive-modal';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '../ui/card';
import { Separator } from '../ui/separator';

export const useWarning = (
	title: string,
	message: string
): [() => JSX.Element, () => Promise<boolean>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void | null;
	} | null>(null);

	const confirmWarning = () => {
		return new Promise<boolean>((resolve) => {
			setPromise({ resolve });
		});
	};

	const handleClose = () => {
		setPromise(null);
	};

	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};

	const WarningDialog = () => (
		<ResponsiveModal open={!!promise} onOpenChange={handleClose}>
			<Card className='rounded-t-none rounded-b-none mt-4'>
				<CardContent>
					<CardHeader>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{message}</CardDescription>
					</CardHeader>
					<Separator />
					<div className='pt-4 w-full justify-center  flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center'>
						<Button
							onClick={handleCancel}
							variant='outline'
							className='w-full lg:w-auto'
						>
							Cancel
						</Button>
					</div>
				</CardContent>
			</Card>
		</ResponsiveModal>
	);

	return [WarningDialog, confirmWarning];
};
