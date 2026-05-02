import { Elysia, t } from 'elysia';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../services/users-service';

const getBearerToken = (headers: Record<string, string | undefined>) => {
  const authorization = headers['authorization'];
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authorization.split(' ')[1];
  if (!token) {
    throw new Error('Unauthorized');
  }

  return token;
};

export const usersRoute = new Elysia({ prefix: '/api' })
  .get('/users/current', async ({ headers, set }) => {
    try {
      const token = getBearerToken(headers);
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
      name: t.String({ maxLength: 255 }),
      email: t.String({ format: 'email', maxLength: 255 }),
      password: t.String({ maxLength: 255 })
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
  })
  .delete('/users/logout', async ({ headers, set }) => {
    try {
      const token = getBearerToken(headers);
      const result = await logoutUser(token);
      return result;
    } catch (error: any) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
  });
