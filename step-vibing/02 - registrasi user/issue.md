# Fitur Registrasi User

## Deskripsi Tugas
Tugas ini bertujuan untuk menambahkan fitur registrasi pengguna baru ke dalam aplikasi backend. Kamu perlu membuat skema database untuk `users`, mengimplementasikan *business logic* untuk pendaftaran termasuk *hashing password* menggunakan algoritma bcrypt, dan membuat *endpoint* API menggunakan ElysiaJS.

## Struktur Folder & Penamaan File
Tambahkan dan gunakan struktur direktori berikut di dalam folder `src/`:
- `src/routes/users-route.ts` (berisi definisi routing ElysiaJS)
- `src/services/users-service.ts` (berisi *business logic* / logika aplikasi)

## Spesifikasi Skema Database
Update file skema Drizzle ORM (misal: `src/db/schema.ts`) dengan menambahkan tabel `users`:
- `id`: integer, primary key, auto increment
- `name`: varchar(255), not null
- `email`: varchar(255), not null, unique
- `password`: varchar(255), not null (menyimpan string password yang sudah di-hash)
- `created_at`: timestamp, default `current_timestamp`

## Spesifikasi API

- **Method & Endpoint**: `POST /api/users`
- **Request Body (JSON)**:
  ```json
  {
    "name": "Juan",
    "email": "juan@email.com",
    "password": "rahasia"
  }
  ```
- **Response Body (Success)**:
  ```json
  {
    "data": "OK"
  }
  ```
- **Response Body (Error - Email Duplikat)**:
  ```json
  {
    "error": "Email sudah terdaftar"
  }
  ```

## Tahapan Implementasi (Langkah demi Langkah)

Untuk menyelesaikan tugas ini, ikuti langkah-langkah berikut secara berurutan:

1. **Update Skema Database (`src/db/schema.ts`)**
   - Definisikan tabel `users` menggunakan fungsi-fungsi dari `drizzle-orm/mysql-core` (seperti `int`, `varchar`, `timestamp`).
   - Pastikan menambahkan *modifier* `.notNull()`, `.unique()`, `.primaryKey()`, dan `.autoincrement()` sesuai spesifikasi.

2. **Buat Business Logic Service (`src/services/users-service.ts`)**
   - Buat fungsi, misalnya `registerUser(payload)`.
   - Di dalam fungsi ini, pertama periksa apakah `email` yang diberikan sudah terdaftar di database. Jika ya, lempar error atau kembalikan status gagal.
   - Jika email belum ada, lakukan *hashing* pada *password* menggunakan bcrypt. (Kamu bisa menggunakan library bawaan `Bun.password` atau menginstal paket `bcrypt`).
   - Simpan data pengguna yang baru (`name`, `email`, dan `password` yang sudah di-hash) ke dalam tabel `users` menggunakan Drizzle.

3. **Buat Controller/Routing (`src/routes/users-route.ts`)**
   - Buat *instance* Elysia baru khusus untuk *route* users.
   - Definisikan *endpoint* `POST /api/users`.
   - Tangkap data dari `body` request.
   - Panggil fungsi `registerUser` dari *service* yang telah dibuat sebelumnya.
   - Tangani logika respons. Jika berhasil kembalikan `{"data": "OK"}`, jika gagal karena email ganda, kembalikan respons error `{"error": "Email sudah terdaftar"}`.

4. **Registrasi Route ke Main App (`src/index.ts`)**
   - Impor `usersRoute` (atau nama fungsi/plugin yang diekspor dari `users-route.ts`).
   - Daftarkan *route* tersebut ke dalam *instance* Elysia utama menggunakan metode `.use()`.

5. **Lakukan Migrasi Database**
   - Gunakan `drizzle-kit` untuk melakukan *generate* dan mengaplikasikan perubahan skema (`users` table) ke server MySQL lokal kamu.
