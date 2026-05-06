# Fitur Login User

## Deskripsi Tugas
Tugas ini bertujuan untuk menambahkan fitur login pengguna ke dalam aplikasi backend. Kamu perlu membuat skema database untuk mencatat sesi login (tabel `sessions`), mengimplementasikan business logic untuk verifikasi kredensial dan pembuatan token (UUID), serta membuat endpoint API login menggunakan ElysiaJS.

## Spesifikasi Skema Database
Update file skema Drizzle ORM (misal: `src/db/schema.ts`) dengan menambahkan tabel `sessions`:

- `id`: integer, primary key, auto increment
- `token`: varchar(255), not null (berisi UUID untuk user yang sedang login)
- `user_id`: integer, not null (foreign key ke tabel `users`)
- `created_at`: timestamp, default current_timestamp

## Spesifikasi API
- **Method & Endpoint**: `POST /api/users/login`
- **Request Body (JSON)**:
  ```json
  {
    "email": "juan@email.com",
    "password": "rahasia"
  }
  ```
- **Response Body (Success)**:
  ```json
  {
    "data": "token_string_berisi_uuid"
  }
  ```
- **Response Body (Error)**:
  ```json
  {
    "error": "Email atau password salah"
  }
  ```

## Struktur Folder & Penamaan File
Gunakan dan sesuaikan struktur direktori berikut di dalam folder `src/`:
- `src/routes/users-route.ts`: Berisi definisi routing ElysiaJS (tambahkan endpoint login di sini).
- `src/services/users-service.ts`: Berisi business logic / logika aplikasi (tambahkan fungsi login di sini).

## Tahapan Implementasi

Untuk menyelesaikan tugas ini, ikuti langkah-langkah berikut secara berurutan:

1. **Update Skema Database (`src/db/schema.ts`)**
   - Definisikan tabel `sessions` menggunakan fungsi dari `drizzle-orm/mysql-core`.
   - Pastikan menggunakan tipe data yang sesuai: `int` untuk `id` (dengan `.primaryKey().autoincrement()`) dan `user_id`. Gunakan `varchar` untuk `token` dan `timestamp` untuk `created_at`.
   - (Opsional/Direkomendasikan) Definisikan relasi foreign key dari `user_id` ke tabel `users`.

2. **Buat Business Logic Service (`src/services/users-service.ts`)**
   - Buat fungsi baru, misalnya `loginUser(payload)`.
   - Di dalam fungsi ini, pertama cari data pengguna berdasarkan `email` di tabel `users`. Jika pengguna tidak ditemukan, segera kembalikan/lempar error "Email atau password salah".
   - Jika pengguna ditemukan, bandingkan `password` yang dikirim dari payload dengan password yang tersimpan di database menggunakan library `bcrypt` (misal: `bcrypt.compare`).
   - Jika password tidak cocok, kembalikan/lempar error "Email atau password salah" (jangan beri tahu secara spesifik bahwa password yang salah demi keamanan).
   - Jika verifikasi berhasil, buat sebuah UUID baru (kamu bisa menggunakan fungsi bawaan seperti `crypto.randomUUID()`) untuk dijadikan `token` sesi.
   - Simpan data sesi login (menyertakan `token` dan `user_id`) ke dalam tabel `sessions`.
   - Kembalikan token tersebut.

3. **Buat Controller/Routing (`src/routes/users-route.ts`)**
   - Tambahkan endpoint `POST /login` pada rute `/api/users`.
   - Tangkap data dari body request dan validasi jika perlu.
   - Panggil fungsi `loginUser` dari service.
   - Tangani logika respons. Jika berhasil, kembalikan `{ "data": "<token>" }`. Jika terjadi error validasi/kredensial, kembalikan respons `{ "error": "Email atau password salah" }` dengan HTTP status code yang sesuai (misal: 400 atau 401).

4. **Lakukan Migrasi Database**
   - Gunakan `drizzle-kit` (misal perintah `generate` dan `push`) untuk membuat file migrasi dan mengaplikasikan pembuatan tabel `sessions` ke database server MySQL.

5. **Pengujian (Testing)**
   - Jalankan server development (misal: `bun run dev`).
   - Gunakan tools seperti `curl`, Postman, atau Bruno untuk melakukan HTTP POST request ke `http://localhost:3000/api/users/login`.
   - **Skenario Sukses**: Kirim email dan password yang valid. Pastikan response mengembalikan JSON berisi `data` dengan string token (UUID).
   - **Skenario Gagal**: Kirim email yang tidak terdaftar, atau password yang salah. Pastikan response mengembalikan JSON berisi `error` dengan pesan "Email atau password salah" dan status code yang sesuai (misal 400/401).
   - Periksa database (tabel `sessions`) untuk memastikan bahwa token sesi benar-benar tersimpan beserta `user_id` yang terhubung.
