import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Image from 'next/image';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import DottedSeparator from './dotted-separator';
import { registerSchema } from '../schemas';
import { useRegister } from '@/hooks/use-register';

function SignUpCard() {
	const { mutate } = useRegister();
	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: z.infer<typeof registerSchema>) => {
		mutate({ json: values });
	};

	return (
		<Card className='w-full h-full max-w-2xl border-none shadow-none mx-auto bg-gradient-to-t md:from-blue-400 from-slate-200 md:to-slate-300 to-slate-200 '>
			<CardHeader className='items-center'>
				<CardTitle className='text-2xl flex items-center'>
					<Image
						src='/assets/church-logo.svg'
						alt='church logo'
						height={30}
						width={30}
						priority
					/>
					<div className='ml-2'>Church Managenent</div>
				</CardTitle>
				<div className='text-xl'>Join us today!</div>
				<CardDescription className='items-center text-center italic'>
					By signing up, you agree to our {''}
					<Link href='/privacy'>
						<span className='text-blue-600'>Privacy Policy</span>
					</Link>{' '}
					{''}
					and {''}
					<Link href='/terms'>
						<span className='text-blue-600'>Terms of Services.</span>
					</Link>
				</CardDescription>
			</CardHeader>
			<DottedSeparator />
			<div className='max-w-96 mx-auto px-6 pb-2 md:pb-6'>
				<Button variant='google' size='sm'>
					<FcGoogle className='mr-2' size={20} />
					Sign up with Google
				</Button>
			</div>
			<div className='max-w-96 mx-auto px-6 pb-2 md:pb-6'>
				<Button variant='github' size='sm'>
					<FaGithub className='mr-2' size={20} />
					Sign up with Github
				</Button>
			</div>
			<DottedSeparator />
			<CardContent className='max-w-2xl mx-auto'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex flex-col space-y-2'
					>
						<FormField
							name='name'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type='name'
											placeholder='Enter name'
											{...field}
											className='p-2'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='email'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type='email'
											placeholder='Enter Email Address'
											{...field}
											className='p-2'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='password'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type='password'
											placeholder='Enter Password'
											{...field}
											className='p-2'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='w-full mx-auto md:py-4'>
							<Button type='submit' onClick={() => onSubmit} variant='primary'>
								Sign Up
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
			<DottedSeparator />
			<CardContent className='flex items-center justify-center'>
				<div className='flex flex-col text-center items-center'>
					Already have an account?
					<Link href='/sign-in'>
						<div className='text-blue-700'>
							<div className='hover:text-blue-900 hover:underline underline-offset-4'>
								LogIn here
							</div>
						</div>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
export default SignUpCard;
