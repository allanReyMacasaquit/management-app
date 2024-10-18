import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email({ message: 'Required *' }),
	password: z.string().min(2, 'Required *'),
});

export const registerSchema = z.object({
	name: z.string().trim().min(2, 'Required *'),
	email: z.string().email({ message: 'Required *' }),
	password: z.string().min(8, 'Required - Minimum at least 8 characters *'),
});
