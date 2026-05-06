# Implementasi Unit Test untuk Semua Endpoint API

## Deskripsi Tugas
Tugas ini bertujuan untuk menambahkan *unit test* secara komprehensif pada seluruh API yang tersedia di aplikasi. Pengujian ini diwajibkan menggunakan *test runner* bawaan dari Bun yaitu `bun test`.

## Persyaratan Teknis
- **Lokasi File Test**: Semua file *test* harus disimpan di dalam direktori `tests/`.
- **Framework Test**: Gunakan API bawaan dari `bun test` (`describe`, `it`, `expect`, `beforeEach`, dll).
- **Konsistensi Data (WAJIB)**: Pada awal setiap eksekusi skenario (misalnya menggunakan blok `beforeEach`), pastikan untuk **menghapus data terkait** di tabel database (seperti tabel `users` dan `sessions`). Hal ini penting agar setiap skenario tes berjalan terisolasi, konsisten, dan tidak bergantung pada sisa data dari tes lain.
- **Detail Implementasi**: Kode *test* dan pengaturan *mock*/*database connection* diserahkan sepenuhnya kepada pemrogram atau model AI untuk diinterpretasikan berdasarkan skenario di bawah.

## Daftar Skenario Pengujian

Harap buatkan pengujian untuk API berikut dengan mencakup semua skenario yang dideskripsikan:

### 1. Endpoint: `POST /api/users` (Register User)
- [ ] Sukses: Berhasil mendaftarkan user baru dengan pengiriman payload data yang valid.
- [ ] Error: Gagal mendaftarkan user jika email sudah terdaftar sebelumnya di database.
- [ ] Error: Gagal mendaftarkan user jika format penulisan email tidak valid (validation error).
- [ ] Error: Gagal mendaftarkan user jika payload tidak lengkap (misalnya tidak ada field `password`).
- [ ] Error: Gagal mendaftarkan user jika panjang string pada `name`, `email`, atau `password` melebihi 255 karakter.

### 2. Endpoint: `POST /api/users/login` (Login User)
- [ ] Sukses: Berhasil login menggunakan email dan password yang benar, serta merespons dengan *auth token*.
- [ ] Error: Gagal login jika menggunakan email yang belum terdaftar.
- [ ] Error: Gagal login jika password yang dikirim salah.
- [ ] Error: Gagal login jika format payload body tidak valid (misal: tanpa field email).

### 3. Endpoint: `GET /api/users/current` (Dapatkan User Saat Ini)
- [ ] Sukses: Berhasil mengambil data profil user dengan melampirkan *header* `Authorization: Bearer <token>` yang valid.
- [ ] Error: Gagal mengambil data user karena request tidak membawa header `Authorization` (Unauthorized).
- [ ] Error: Gagal mengambil data user karena *token* yang dikirim salah, sembarang, atau sudah kedaluwarsa/tidak ada di database.

### 4. Endpoint: `DELETE /api/users/logout` (Logout User)
- [ ] Sukses: Berhasil melakukan *logout* menggunakan token valid. Sistem harus menghapus *session/token* tersebut dari database sehingga tidak bisa digunakan lagi.
- [ ] Error: Gagal melakukan *logout* jika request tidak menyertakan header *Authorization*.
- [ ] Error: Gagal melakukan *logout* jika token yang dikirim tidak valid atau sudah dihapus dari database.
