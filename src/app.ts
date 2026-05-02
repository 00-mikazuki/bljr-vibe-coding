import { Elysia } from 'elysia';
import { usersRoute } from './routes/users-route';

export const app = new Elysia()
  .use(usersRoute)
  .get('/', () => ({ status: 'OK', message: 'Bun + Elysia server is running' }));
