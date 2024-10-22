import { z } from 'zod';

export const workspacesSchema = z.object({
	name: z.string().trim().min(1, 'Required'),
});
