import { Elysia, t } from 'elysia';
import { registerUser, loginUser, getCurrentUser } from '../services/users-service';

export const usersRoute = new Elysia({ prefix: '/api' })
  .get('/users/current', async ({ headers, set }) => {
    try {
      const authorization = headers['authorization'];
      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
      }

      const token = authorization.split(' ')[1];
      if (!token) {
        throw new Error('Unauthorized');
      }

      const result = await getCurrentUser(token);
      return result;
    } catch (error: any) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
  })
  .post('/users', async ({ body, set }) => {
    try {
      const result = await registerUser(body);
      return result;
    } catch (error: any) {
      if (error.message === 'Email sudah terdaftar') {
        set.status = 400;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
      password: t.String()
    })
  })
  .post('/users/login', async ({ body, set }) => {
    try {
      const result = await loginUser(body);
      return result;
    } catch (error: any) {
      if (error.message === 'Email atau password salah') {
        set.status = 401;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String()
    })
  });
