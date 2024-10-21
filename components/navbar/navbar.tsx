import MobileSidebar from '../sidebar/mobile-sidebar';
import UserButton from '../user/user-button';

function Navbar() {
	return (
		<nav className='p-6 flex items-center justify-between'>
			<div className='hidden flex-col lg:flex'>
				<h1 className='text-2xl font-semibold'>Home</h1>
				<p className='text-muted-foreground'>Projects and Tasks</p>
			</div>
			<MobileSidebar />
			<UserButton />
		</nav>
	);
}
export default Navbar;
