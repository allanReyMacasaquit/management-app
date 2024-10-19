'use server';

import { AUTH_COOKIE } from '@/app/server/constant';
import { cookies } from 'next/headers';
import { Client, Account } from 'node-appwrite';
export const getCurrent = async () => {
	const client = new Client()
		.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
		.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

	const session = cookies().get(AUTH_COOKIE);

	if (!session) return null;

	client.setSession(session.value);

	const account = new Account(client);

	try {
		return await account.get();
	} catch (error) {
		if (error) return null;
	}
};
