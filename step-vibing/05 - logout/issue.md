# Implementasi Fitur Logout User

## Deskripsi Tugas
Tugas ini adalah untuk mengimplementasikan API endpoint untuk proses logout user. Saat user melakukan logout, token session mereka harus dihapus dari database (tabel `sessions`) sehingga token tersebut tidak lagi valid untuk digunakan pada request selanjutnya.

## Spesifikasi API

- **Endpoint**: `DELETE /api/users/logout`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer ${token}"
  }
  ```
  *(Catatan: `token` adalah token yang tersimpan di tabel `sessions`)*

- **Response Body (Success - 200 OK)**:
  ```json
  {
    "data": "OK"
  }
  ```

- **Response Body (Error - 401 Unauthorized)**:
  Muncul jika token tidak valid, tidak ditemukan, atau tidak ada header Authorization.
  ```json
  {
    "error": "Unauthorized"
  }
  ```

## Struktur Proyek
- **Routes (`src/routes/`)**: Berisi routing ElysiaJS. File yang akan dimodifikasi/dibuat adalah `users-route.ts`. Endpoint didefinisikan di sini.
- **Services (`src/services/`)**: Berisi logika bisnis aplikasi. File yang akan dimodifikasi/dibuat adalah `users-service.ts`. Logika untuk menghapus token dari database berada di sini.

---

## Tahapan Implementasi (Step-by-Step Guide)

Ikuti langkah-langkah di bawah ini secara berurutan untuk mengimplementasikan fitur:

### Langkah 1: Buat Logika Logout di Service (`src/services/users-service.ts`)
1. Buka file `src/services/users-service.ts`.
2. Buat sebuah function/method baru, misalnya bernama `logout(token: string)`.
3. Di dalam function tersebut, lakukan pengecekan apakah `token` ada di dalam tabel `sessions` pada database (menggunakan Drizzle ORM).
4. Jika token **tidak ditemukan**, lemparkan sebuah error (throw error) yang menandakan Unauthorized (atau biarkan ditangani oleh handler khusus jika ada).
5. Jika token **ditemukan**, jalankan operasi `DELETE` pada tabel `sessions` berdasarkan token tersebut.
6. Kembalikan nilai string `"OK"` atau boolean `true` yang akan diteruskan ke controller/route.

### Langkah 2: Buat Endpoint Logout di Route (`src/routes/users-route.ts`)
1. Buka file `src/routes/users-route.ts`.
2. Tambahkan route baru dengan HTTP method `DELETE` pada path `/api/users/logout` (atau sesuaikan dengan prefix route grup jika ada).
3. Di dalam handler route tersebut, tangkap nilai token dari header `Authorization`. 
   - *Penting*: Format header biasanya adalah `Bearer <token>`, jadi kamu perlu memisahkan kata `Bearer` untuk mendapatkan nilai `<token>` aslinya.
4. Jika header `Authorization` kosong atau formatnya tidak sesuai, langsung kembalikan respons error `{"error": "Unauthorized"}` dengan status HTTP `401`.
5. Panggil function `logout(token)` yang ada di `users-service.ts` (dari Langkah 1) dengan mengirimkan token yang sudah diparsing.
6. Berikan respons sukses jika proses di service berhasil:
   ```json
   {
     "data": "OK"
   }
   ```
7. Pastikan ada penanganan error (try-catch). Jika service melempar error (karena token tidak ditemukan di database), tangkap error tersebut dan kembalikan respons:
   ```json
   {
     "error": "Unauthorized"
   }
   ```
   dengan status HTTP `401`.

### Langkah 3: Registrasi Route (Jika file route baru)
*Abaikan langkah ini jika endpoint hanya ditambahkan ke `users-route.ts` yang sudah diregistrasi ke aplikasi utama.*
1. Pastikan `users-route.ts` sudah di-import dan digunakan (register) ke dalam instance utama Elysia (biasanya di `src/index.ts`).

### Langkah 4: Pengujian (Testing) Manual
1. Jalankan server secara lokal (contoh: `bun run dev`).
2. **Test Case 1 (Sukses)**: 
   - Lakukan login terlebih dahulu untuk mendapatkan token dan simpan di database.
   - Kirim request `DELETE /api/users/logout` menggunakan curl/Postman dengan header `Authorization: Bearer <token>`. 
   - Pastikan mendapat respons `{"data": "OK"}`.
   - Cek database untuk memastikan token tersebut sudah benar-benar terhapus dari tabel `sessions`.
3. **Test Case 2 (Error)**: 
   - Kirim request `DELETE /api/users/logout` dengan token yang salah/ngarang, atau tanpa menyertakan header `Authorization`. 
   - Pastikan mendapat respons `{"error": "Unauthorized"}` dengan HTTP status 401.

## Catatan Tambahan
- Selalu gunakan Drizzle ORM sesuai dengan standar proyek ini untuk interaksi database.
- Pastikan gaya penulisan kode (code style), penamaan variabel, dan struktur error handling konsisten dengan endpoint lain yang sudah ada di dalam proyek ini.
