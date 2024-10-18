import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { loginSchema, registerSchema } from '@/features/schemas';

const app = new Hono()
	.post('/login', zValidator('json', loginSchema), (c) => {
		const { email, password } = c.req.valid('json');
		console.log(`Email ${email}, Password ${password}`);

		return c.json({ email, password });
	})
	.post('/register', zValidator('json', registerSchema), (c) => {
		const { name, email, password } = c.req.valid('json');
		console.log(`Name ${name}Email ${email}, Password ${password}`);

		return c.json({ name, email, password });
	});
export default app;
