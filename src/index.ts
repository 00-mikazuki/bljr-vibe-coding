import { app } from './app';

app.listen(3000);

console.log(
  `🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
