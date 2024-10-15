import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email({ message: 'Required *' }),
	password: z.string().min(2, 'Required *'),
});
