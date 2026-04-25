import { Elysia } from 'elysia';

const app = new Elysia()
  .get('/', () => ({ status: 'OK', message: 'Bun + Elysia server is running' }))
  .listen(3000);

console.log(
  `🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
