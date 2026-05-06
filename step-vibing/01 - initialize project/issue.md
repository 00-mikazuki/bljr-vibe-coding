# Inisialisasi Proyek: Bun + ElysiaJS + Drizzle + MySQL

## Tujuan
Menyiapkan proyek backend baru menggunakan Bun, ElysiaJS, Drizzle ORM, dan MySQL. Dokumen ini menguraikan langkah-langkah tingkat tinggi (high-level) untuk implementasinya.

## Langkah-Langkah Implementasi

1. **Inisialisasi Proyek**
   - Inisialisasi proyek Bun baru di direktori ini.
   - Pastikan struktur dasar proyek telah dibuat (misalnya, folder `src/` untuk kode sumber).

2. **Instalasi Dependensi**
   - Tambahkan dependensi utama ke dalam proyek:
     - `elysia` untuk framework web.
     - `drizzle-orm` dan `mysql2` untuk interaksi dengan database.
   - Tambahkan dependensi development yang dibutuhkan:
     - `drizzle-kit` untuk manajemen skema dan migrasi database.

3. **Konfigurasi Database (Drizzle ORM)**
   - Buat file definisi skema database dasar.
   - Siapkan utilitas koneksi database menggunakan driver MySQL.
   - Buat file `drizzle.config.ts` untuk mengonfigurasi Drizzle Kit pada proyek.

4. **Pengaturan Server (ElysiaJS)**
   - Buat file utama untuk menjalankan aplikasi (misalnya `src/index.ts`).
   - Inisialisasi server Elysia dan atur agar berjalan pada port default (misalnya port 3000).
   - Tambahkan endpoint *health-check* sederhana (misalnya `GET /`) untuk memastikan server berjalan dengan baik.

5. **Variabel Lingkungan (Environment Variables)**
   - Siapkan file `.env` (beserta template `.env.example`) untuk mengelola konfigurasi.
   - Masukkan variabel untuk koneksi database (misalnya `DATABASE_URL`).
