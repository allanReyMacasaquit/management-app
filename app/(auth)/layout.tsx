import Header from '@/components/header/header';

interface AuthLayoutProps {
	children: React.ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<main className='min-h-screen'>
			<div className='bg-slate-300'>
				<Header />
			</div>
			<div className='flex flex-col justify-center items-center pt-24 md:pt-32'>
				{children}
			</div>
		</main>
	);
}
export default AuthLayout;
