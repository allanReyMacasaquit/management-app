import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import DottedSeparator from '@/app/(auth)/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const formSchema = z.object({
	email: z.string().email({ message: 'Required *' }),
	password: z.string().min(2, 'Required *'),
});
function SignInCard() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log({ values });
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
				<div className='text-xl'>Welcome!</div>
			</CardHeader>
			<DottedSeparator />
			<div className='max-w-96 mx-auto px-6 pb-2 md:pb-6'>
				<Button variant='google' size='sm'>
					<FcGoogle className='mr-2' size={20} />
					Login with Google
				</Button>
			</div>
			<div className='max-w-96 mx-auto px-6 pb-2 md:pb-6'>
				<Button variant='github' size='sm'>
					<FaGithub className='mr-2' size={20} />
					Login with Github
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
							name='email'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type='email'
											placeholder='Email Address'
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
											placeholder='Password'
											{...field}
											className='p-2'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='w-full mx-auto md:py-4'>
							<Button variant='primary'>Login</Button>
						</div>
					</form>
				</Form>
			</CardContent>
			<DottedSeparator />
			<CardContent className='flex items-center justify-center'>
				<div className='flex flex-col text-center items-center'>
					Don't have an account?
					<Link href='/sign-up'>
						<div className='text-blue-700'>
							<div className='hover:text-blue-900 hover:underline underline-offset-4'>
								Sign Up
							</div>
						</div>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
export default SignInCard;
