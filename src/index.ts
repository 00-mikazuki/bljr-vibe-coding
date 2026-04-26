import { Elysia } from 'elysia';
import { usersRoute } from './routes/users-route';

const app = new Elysia()
  .use(usersRoute)
  .get('/', () => ({ status: 'OK', message: 'Bun + Elysia server is running' }))
  .listen(3000);

console.log(
  `🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
