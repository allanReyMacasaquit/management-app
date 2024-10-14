import DottedSeparator from '@/app/(auth)/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Image from 'next/image';
function SignInCard() {
	return (
		<Card className='w-full h-full max-w-2xl border-none shadow-none mx-auto bg-gradient-to-t from-blue-400 to-slate-200'>
			<CardHeader className='items-center'>
				<CardTitle className='text-2xl flex items-center'>
					<Image
						src='/assets/church-logo.svg'
						alt='church logo'
						height={30}
						width={30}
						priority
					/>
					<div className='ml-5'>Church Managenent</div>
				</CardTitle>
				<div className='text-xl'>Welcome!</div>
			</CardHeader>
			<DottedSeparator />
			<div className='max-w-96 mx-auto px-6 pb-6'>
				<Button variant='google' size='sm'>
					<FcGoogle className='mr-2' size={20} />
					Login with Google
				</Button>
			</div>
			<div className='max-w-96 mx-auto px-6 pb-6'>
				<Button variant='github' size='sm'>
					<FaGithub className='mr-2' size={20} />
					Login with Github
				</Button>
			</div>
			<DottedSeparator />
			<CardContent className='max-w-2xl px-12 mx-auto'>
				<form className='flex flex-col space-y-2'>
					<label htmlFor='email'>Email</label>
					<input
						id='email'
						name='email'
						type='email'
						onChange={() => {}}
						aria-label='Email Address'
						placeholder='Email Address'
						disabled={false}
						required
						className='p-2'
					/>
					<label htmlFor='password'>Password</label>
					<input
						id='password'
						name='password'
						type='password'
						onChange={() => {}}
						aria-label='Password'
						placeholder='Password'
						disabled={false}
						required
						className='p-2'
					/>
				</form>
			</CardContent>
			<div className='max-w-72 md:max-w-xl mx-auto pb-10'>
				<Button variant='primary'>Login</Button>
			</div>
		</Card>
	);
}
export default SignInCard;
