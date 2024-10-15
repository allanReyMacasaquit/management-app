import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { loginSchema } from '@/features/schemas';

const app = new Hono().post(
	'/login',
	zValidator('json', loginSchema),
	(context) => {
		return context.json({ success: 'ok' });
	}
);
export default app;
