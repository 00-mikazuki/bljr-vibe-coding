# Bljr Vibe Coding - Backend API

Aplikasi ini adalah sebuah backend RESTful API sederhana yang dibangun menggunakan runtime **Bun** dan framework **ElysiaJS**. Aplikasi ini menyediakan fitur otentikasi pengguna (*user authentication*) dasar seperti registrasi, login, pengambilan data profil pengguna saat ini, dan logout. Database yang digunakan adalah **MySQL** yang diintegrasikan menggunakan **Drizzle ORM**.

## 🛠️ Technology Stack & Libraries

Proyek ini dibangun di atas tumpukan teknologi modern berikut:
- **Runtime**: [Bun](https://bun.sh/) - Runtime JavaScript all-in-one yang sangat cepat.
- **Framework**: [ElysiaJS](https://elysiajs.com/) - Web framework berkinerja tinggi untuk Bun.
- **Database**: MySQL - Relational Database Management System.
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (`drizzle-orm`) - TypeScript ORM yang ringan dan *type-safe*.
- **Database Driver**: `mysql2` - Driver MySQL untuk Node.js/Bun.
- **Security**: `bcrypt` - Library untuk melakukan *hashing* pada *password* pengguna.
- **Validation**: TypeBox (bawaan dari Elysia) - Digunakan untuk validasi skema HTTP request body.
- **Testing**: `bun test` - Test runner bawaan dari Bun.

## 📂 Arsitektur dan Struktur Folder

Aplikasi ini mengadopsi arsitektur berlapis (*layered architecture*) sederhana untuk memisahkan tanggung jawab (*separation of concerns*), yaitu memisahkan bagian routing (HTTP layer), logika bisnis (services layer), dan akses data (data layer).

Penamaan file secara konsisten menggunakan format **kebab-case** (misalnya: `users-route.ts`, `users-service.ts`).

Struktur direktorinya adalah sebagai berikut:

```text
bljr-vibe-coding/
├── src/
│   ├── db/                 # Data Layer (Koneksi Database & Schema Drizzle)
│   │   ├── index.ts        # Inisialisasi koneksi MySQL dan instance Drizzle
│   │   └── schema.ts       # Definisi skema tabel database (users, sessions)
│   ├── routes/             # HTTP Layer (Definisi endpoint, validasi request)
│   │   └── users-route.ts  # Endpoint terkait pengguna
│   ├── services/           # Business Logic Layer (Logika utama aplikasi)
│   │   └── users-service.ts# Logika registrasi, login, pengecekan token, dll
│   ├── app.ts              # Inisialisasi dan konfigurasi aplikasi Elysia (tanpa listen)
│   └── index.ts            # Entry point aplikasi (menjalankan server)
├── tests/                  # Direktori khusus untuk file unit test
│   └── user.test.ts        # Unit test untuk API pengguna
├── drizzle/                # Direktori yang berisi file riwayat migrasi database
├── .env                    # File konfigurasi environment variable
└── package.json            # Daftar dependencies dan script proyek
```

## 🗄️ Database Schema

Aplikasi ini memiliki 2 tabel utama di dalam database:

1. **`users`**
   - `id` (INT, Primary Key, Auto Increment)
   - `name` (VARCHAR 255, Not Null)
   - `email` (VARCHAR 255, Not Null, Unique)
   - `password` (VARCHAR 255, Not Null) - *Menyimpan password yang sudah di-hash.*
   - `createdAt` (TIMESTAMP, Default: CURRENT_TIMESTAMP)

2. **`sessions`**
   - `id` (INT, Primary Key, Auto Increment)
   - `token` (VARCHAR 255, Not Null) - *Menyimpan access token.*
   - `userId` (INT, Foreign Key references `users.id`)
   - `createdAt` (TIMESTAMP, Default: CURRENT_TIMESTAMP)

## 🌐 API yang Tersedia

Berikut adalah daftar endpoint API yang tersedia. Seluruh API (kecuali root) memiliki prefix `/api`.

1. **Root URL**
   - `GET /`
   - Mengembalikan pesan status pengecekan server.

2. **Register User**
   - `POST /api/users`
   - Mendaftarkan akun baru.
   - **Body (JSON)**: `name` (max: 255 chars), `email` (format email), `password` (max: 255 chars).
   - **Response**: `{ "data": "OK" }`

3. **Login User**
   - `POST /api/users/login`
   - Melakukan autentikasi dan mengembalikan sesi/token.
   - **Body (JSON)**: `email`, `password`.
   - **Response**: `{ "data": "<auth_token>" }`

4. **Get Current User**
   - `GET /api/users/current`
   - Mengambil data profil user yang sedang login.
   - **Headers**: `Authorization: Bearer <auth_token>`
   - **Response**: `{ "data": { "id": 1, "name": "...", "email": "...", "createdAt": "..." } }`

5. **Logout User**
   - `DELETE /api/users/logout`
   - Mengakhiri sesi pengguna dengan menghapus token di database.
   - **Headers**: `Authorization: Bearer <auth_token>`
   - **Response**: `{ "data": "OK" }`

## 🚀 Cara Setup dan Menjalankan Proyek

### 1. Prasyarat
- Pastikan [Bun](https://bun.sh/) sudah terpasang di sistem Anda.
- Pastikan Anda memiliki layanan server **MySQL** yang berjalan.

### 2. Instalasi Dependencies
Buka terminal di dalam direktori root proyek dan jalankan:
```bash
bun install
```

### 3. Konfigurasi Environment
Salin file template `.env.example` menjadi `.env` lalu sesuaikan dengan konfigurasi database Anda.
```bash
cp .env.example .env
```
Isi variabel `DATABASE_URL` di dalam file `.env`, contohnya:
```env
DATABASE_URL="mysql://root:password@localhost:3306/nama_database"
```

### 4. Menjalankan Aplikasi
- **Development Mode** (dengan auto-reload saat ada perubahan file):
  ```bash
  bun run dev
  ```
- **Production Mode**:
  ```bash
  bun start
  ```
Secara default, server akan berjalan dan mendengarkan permintaan di `http://localhost:3000`.

## 🧪 Cara Melakukan Pengujian (Testing)

Proyek ini telah dilengkapi dengan *unit tests* menggunakan runner bawaan `bun test`. Karena tes melibatkan operasi database sesungguhnya, pastikan kredensial di `.env` valid. Disarankan untuk menggunakan database khusus *testing* agar data asli Anda tidak tertimpa/terhapus.

Untuk menjalankan semua skenario pengujian:
```bash
bun test
```
