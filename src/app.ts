import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { usersRoute } from './routes/users-route';

export const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Bljr Vibe Coding API Documentation',
          version: '1.0.0',
        },
      },
    })
  )
  .use(usersRoute)
  .get('/', () => ({ status: 'OK', message: 'Bun + Elysia server is running' }));
