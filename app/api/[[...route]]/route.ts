import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import auth from '../../server/route';

import workspaces from '../../../appwrite/workspaces/server/route';
export const app = new Hono().basePath('/api');

export const routes = app.route('/auth', auth).route('/workspaces', workspaces);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
