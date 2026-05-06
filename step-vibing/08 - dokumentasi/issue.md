# Implementasi Fitur Swagger API Documentation

## Deskripsi Singkat
Tujuan dari issue ini adalah menambahkan fitur Swagger UI ke dalam proyek backend kita yang menggunakan framework **ElysiaJS**. Fitur ini akan sangat membantu developer lain atau pengguna API untuk melihat daftar *endpoint*, parameter yang dibutuhkan, format *response*, serta mencoba (test) API secara langsung dari *browser* tanpa perlu menggunakan aplikasi tambahan seperti Postman.

## Target Implementator
Dokumen ini disusun agar mudah diikuti oleh **Junior Programmer** atau **AI Model** yang ditugaskan untuk mengerjakan fitur ini.

---

## Langkah-Langkah Implementasi

Berikut adalah tahapan mendetail yang harus kamu lakukan untuk menambahkan Swagger ke dalam *project*:

### 1. Instalasi Plugin Swagger
ElysiaJS memiliki *plugin* resmi untuk Swagger. Langkah pertama yang harus kamu lakukan adalah menginstal dependensi tersebut menggunakan **Bun**.

Jalankan perintah berikut di terminal:
```bash
bun add @elysiajs/swagger
```

### 2. Konfigurasi Swagger di `src/app.ts`
Setelah plugin berhasil diinstal, kamu perlu mendaftarkan (register) *plugin* tersebut ke dalam instance aplikasi Elysia utama kita yang berada di `src/app.ts`.

Buka file `src/app.ts` dan lakukan perubahan berikut:

**Langkah-langkah:**
1. Tambahkan impor `swagger` dari `@elysiajs/swagger` di bagian paling atas.
2. Sisipkan `.use(swagger())` pada inisialisasi instance Elysia, **sebelum** mendaftarkan rute (route) yang sudah ada.

**Contoh Perubahan Code:**
```typescript
import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger'; // <-- [NEW] Tambahkan baris ini
import { usersRoute } from './routes/users-route';

export const app = new Elysia()
  .use(swagger({ // <-- [NEW] Daftarkan plugin swagger di sini
      documentation: {
          info: {
              title: 'Bljr Vibe Coding API Documentation',
              version: '1.0.0'
          }
      }
  }))
  .use(usersRoute)
  .get('/', () => ({ status: 'OK', message: 'Bun + Elysia server is running' }));
```

### 3. Pengujian (Testing)
Setelah kode disimpan, jalankan server secara lokal untuk memastikan Swagger UI sudah dapat diakses.

1. Jalankan aplikasi (biasanya menggunakan `bun run dev` atau sejenisnya, pastikan server berjalan).
2. Buka *browser* pilihanmu (Chrome/Firefox/dsb).
3. Akses URL: `http://localhost:3000/swagger` (sesuaikan port jika server berjalan di port lain).
4. **Ekspektasi:** Kamu akan melihat antarmuka (UI) interaktif Swagger yang menampilkan rute bawaan (seperti `/` dan rute dari `usersRoute`).

### 4. Menambahkan Validasi & Deskripsi pada Rute (Opsional namun Direkomendasikan)
Agar dokumentasi Swagger terlihat lengkap, pastikan bahwa *route* yang ada di `src/routes/users-route.ts` (dan rute lainnya di masa depan) menggunakan fitur validasi skema bawaan Elysia (`t` dari `elysia`). Elysia secara otomatis membaca skema validasi tersebut dan menampilkannya di Swagger.

*Catatan: Langkah 4 ini adalah informasi tambahan. Fokus utama kamu adalah memastikan Langkah 1 - 3 berjalan dan halaman UI Swagger berhasil dirender.*

---

## Kriteria Penerimaan (Acceptance Criteria)
- [ ] Paket `@elysiajs/swagger` berhasil ditambahkan di `package.json`.
- [ ] Kode di `src/app.ts` berhasil diperbarui tanpa adanya *error* TypeScript.
- [ ] Halaman dokumentasi UI interaktif berhasil diakses melalui *browser* di *path* `/swagger`.
- [ ] Informasi dasar API (seperti judul dan versi) tampil di halaman Swagger.

Semoga berhasil! Jika menemui kendala, periksa kembali dokumentasi resmi [Elysia Swagger Plugin](https://elysiajs.com/plugins/swagger.html).
