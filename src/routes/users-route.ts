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
  }, {
    detail: {
      summary: 'Dapatkan data pengguna saat ini',
      description: 'Mengambil profil pengguna yang sedang login berdasarkan token bearer.'
    },
    response: {
      200: t.Object({
        data: t.Object({
          id: t.Number(),
          name: t.String(),
          email: t.String({ format: 'email' }),
          createdAt: t.Date()
        })
      }, { description: 'Data profil berhasil diambil' }),
      401: t.Object({
        error: t.String()
      }, { description: 'Sesi tidak valid atau token tidak ditemukan' })
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
    detail: {
      summary: 'Registrasi pengguna baru',
      description: 'Mendaftarkan akun baru ke dalam sistem.'
    },
    body: t.Object({
      name: t.String({ maxLength: 255 }),
      email: t.String({ format: 'email', maxLength: 255 }),
      password: t.String({ maxLength: 255 })
    }),
    response: {
      200: t.Object({
        data: t.String()
      }, { description: 'Registrasi berhasil' }),
      400: t.Object({
        error: t.String()
      }, { description: 'Email sudah terdaftar' }),
      500: t.Object({
        error: t.String()
      }, { description: 'Terjadi kesalahan pada server' })
    }
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
    detail: {
      summary: 'Login pengguna',
      description: 'Otentikasi pengguna untuk mendapatkan token sesi.'
    },
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String()
    }),
    response: {
      200: t.Object({
        data: t.String()
      }, { description: 'Login berhasil, token diberikan' }),
      401: t.Object({
        error: t.String()
      }, { description: 'Email atau password salah' }),
      500: t.Object({
        error: t.String()
      }, { description: 'Terjadi kesalahan pada server' })
    }
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
  }, {
    detail: {
      summary: 'Logout pengguna',
      description: 'Menghapus sesi aktif berdasarkan token bearer yang diberikan.'
    },
    response: {
      200: t.Object({
        data: t.String()
      }, { description: 'Logout berhasil' }),
      401: t.Object({
        error: t.String()
      }, { description: 'Sesi tidak valid atau sudah logout' })
    }
  });
