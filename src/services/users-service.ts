import { db } from '../db';
import { users, sessions } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

/**
 * Mendaftarkan pengguna baru ke dalam sistem.
 * Fungsi ini akan mengecek apakah email sudah terdaftar, melakukan hashing pada password,
 * dan menyimpan data pengguna ke dalam database.
 *
 * @param {any} payload - Data yang dibutuhkan untuk registrasi (name, email, password)
 * @returns {Promise<{data: string}>} Mengembalikan status 'OK' jika registrasi berhasil
 * @throws {Error} Jika email sudah terdaftar di database
 */
export const registerUser = async (payload: any) => {
  const { name, email, password } = payload;

  // 1. Check if email already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error('Email sudah terdaftar');
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Save user to database
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: 'OK' };
};

/**
 * Melakukan proses otentikasi (login) pengguna.
 * Fungsi ini memverifikasi email dan password, kemudian menghasilkan
 * token sesi baru (UUID) dan menyimpannya ke dalam database jika otentikasi berhasil.
 *
 * @param {any} payload - Data kredensial pengguna (email, password)
 * @returns {Promise<{data: string}>} Mengembalikan token sesi jika login berhasil
 * @throws {Error} Jika email tidak ditemukan atau password salah
 */
export const loginUser = async (payload: any) => {
  const { email, password } = payload;

  // 1. Find user by email
  const [foundUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!foundUser) {
    throw new Error('Email atau password salah');
  }

  // 2. Verify password
  const isPasswordValid = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordValid) {
    throw new Error('Email atau password salah');
  }

  // 3. Generate token
  const token = crypto.randomUUID();

  // 4. Save session
  await db.insert(sessions).values({
    token,
    userId: foundUser.id,
  });

  return { data: token };
};

/**
 * Mengambil data pengguna yang sedang login (current user) berdasarkan token sesi aktif.
 * Fungsi ini melakukan join antara tabel sessions dan users untuk mendapatkan
 * informasi profil pengguna terkait.
 *
 * @param {string} token - Token sesi yang sedang aktif
 * @returns {Promise<{data: object}>} Mengembalikan data profil pengguna (id, name, email, createdAt)
 * @throws {Error} Jika sesi tidak ditemukan atau tidak valid (Unauthorized)
 */
export const getCurrentUser = async (token: string) => {
  const [result] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);

  if (!result) {
    throw new Error('Unauthorized');
  }

  return { data: result };
};

/**
 * Mengakhiri sesi pengguna (logout).
 * Fungsi ini menghapus data sesi yang terkait dengan token yang diberikan
 * dari database, sehingga token tersebut tidak dapat digunakan lagi.
 *
 * @param {string} token - Token sesi yang akan dihapus
 * @returns {Promise<{data: string}>} Mengembalikan status 'OK' jika logout berhasil
 * @throws {Error} Jika sesi tidak ditemukan atau tidak valid (Unauthorized)
 */
export const logoutUser = async (token: string) => {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  if (!session) {
    throw new Error('Unauthorized');
  }

  await db.delete(sessions).where(eq(sessions.token, token));

  return { data: 'OK' };
};
