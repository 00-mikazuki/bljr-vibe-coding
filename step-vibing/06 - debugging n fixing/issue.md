# Bug: Silent Truncation pada Field Registrasi User

## Deskripsi Masalah (Bug Description)
Saat ini endpoint registrasi `POST /api/users` tidak memvalidasi panjang maksimum dari *field* input, khususnya untuk `name`. Karena pada skema database MySQL (`src/db/schema.ts`) kolom ini diatur sebagai `varchar(255)`, maka menginputkan nama yang panjangnya lebih dari 255 karakter akan berhasil (`200 OK`) namun MySQL secara otomatis dan diam-diam akan memotong nilainya (silent truncation).

Ini adalah hal yang tidak diinginkan, seharusnya API memblokir permintaan tersebut dengan pesan error yang sesuai (400 Bad Request).

## Lokasi File yang Perlu Diubah
- `src/routes/users-route.ts`

## Langkah-langkah Perbaikan (Implementation Steps)

Untuk para *junior programmer* atau model AI, silakan ikuti panduan berikut ini:

1. **Buka File Route**
   Buka file `src/routes/users-route.ts`.

2. **Cari Blok Validasi Registrasi**
   Cari baris yang mengatur validasi `body` untuk *route* `POST /api/users`. Saat ini kodenya terlihat seperti ini:
   ```typescript
   body: t.Object({
     name: t.String(),
     email: t.String({ format: 'email' }),
     password: t.String()
   })
   ```

3. **Tambahkan Batasan Panjang (maxLength)**
   Tambahkan aturan `maxLength: 255` menggunakan fungsi bawaan *TypeBox* dari ElysiaJS pada properti `name`, `email`, dan `password` agar sinkron dengan batasan panjang kolom database. Ubah kodenya menjadi:
   ```typescript
   body: t.Object({
     name: t.String({ maxLength: 255 }),
     email: t.String({ format: 'email', maxLength: 255 }),
     password: t.String({ maxLength: 255 })
   })
   ```

4. **Verifikasi dan Pengujian**
   - Pastikan aplikasi berjalan (`bun run dev`).
   - Lakukan uji coba (*testing*) dengan mengirim *HTTP POST request* ke `http://localhost:3000/api/users`.
   - Gunakan `name` dengan panjang lebih dari 255 karakter (misal: 300 karakter).
   - Verifikasi bahwa sistem kini akan mengembalikan error bawaan dari Elysia (validasi gagal) yang mencegah data diteruskan ke level database, alih-alih mengembalikan `200 OK`.

## Kriteria Sukses
Bug dianggap *solved* jika kita mencoba mendaftar dengan nama yang panjangnya di atas 255 karakter dan API memberikan respons gagal (Error/Bad Request) terkait panjang *string*.
