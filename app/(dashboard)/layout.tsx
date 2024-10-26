import CreateWorkspaceModal from '@/appwrite/workspaces/components/create-workspace-modal';
import Navbar from '@/components/navbar/navbar';
import Sidebar from '@/components/sidebar/sidebar';
import React from 'react';

interface DashboardlayoutProps {
	children: React.ReactNode;
}
function Dashboardlayout({ children }: DashboardlayoutProps) {
	return (
		<div className='min-h-screen'>
			<CreateWorkspaceModal />
			<div className='flex w-full h-full'>
				<div className='fixed left-0 top-0 hidden lg:block lg:w-60 h-full overflow-y-auto'>
					<Sidebar />
				</div>
				<div className='lg:pl-60 w-full'>
					<div className='mx-auto max-w-screen-2xl h-full'>
						<Navbar />
						<main className='min-h-screen sm:p-6 flex flex-col'>
							{children}
						</main>
					</div>
				</div>
			</div>
		</div>
	);
}
export default Dashboardlayout;
