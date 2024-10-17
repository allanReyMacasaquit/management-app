import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema } from '@/features/schemas';

const app = new Hono().post('/login', zValidator('json', loginSchema), (c) => {
	return c.json({ success: 'ok' });
});
export default app;