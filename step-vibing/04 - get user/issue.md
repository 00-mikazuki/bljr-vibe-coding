# Task: Implementasi API Get Current User

**Deskripsi:**
Buat sebuah API endpoint untuk mengambil data user yang sedang login saat ini berdasarkan token yang dikirim melalui header `Authorization`.

## Spesifikasi API

- **Endpoint:** `GET /api/users/current`
- **Headers:**
  - `Authorization: Bearer <token>` (Token ini mereferensikan token yang ada di tabel `sessions`)

### Response (Success)
```json
{
  "data": {
    "id": 1,
    "name": "juan",
    "email": "juan@email.com",
    "created_at": "timestamp"
  }
}
```

### Response (Error - Unauthorized)
```json
{
  "error": "Unauthorized"
}
```

## Struktur File dan Direktori
Implementasi ini harus mengikuti struktur folder berikut yang berada di dalam folder `src/`:
- `src/routes/`: Berisi logic routing ElysiaJS. Gunakan format nama file `users-route.ts`.
- `src/services/`: Berisi logic bisnis aplikasi. Gunakan format nama file `users-service.ts`.

---

## Tahapan Implementasi (Langkah demi Langkah)

Berikut adalah instruksi detail untuk menyelesaikan task ini. Silakan ikuti urutan berikut secara berurutan:

### 1. Buat/Update Service (`src/services/users-service.ts`)
1. Buka file `src/services/users-service.ts` (buat jika belum ada).
2. Buat sebuah function (misalnya bernama `getCurrentUser(token: string)`).
3. **Validasi Token:**
   - Lakukan query ke database untuk mencari data di tabel `sessions` berdasarkan parameter `token` yang diberikan.
   - Dapatkan informasi user yang berelasi dengan session tersebut. Ini bisa dilakukan melalui table *join* atau query ke tabel `users` menggunakan `user_id` dari data session.
4. **Error Handling:**
   - Jika data session tidak ditemukan (token invalid/expired), *throw* sebuah error atau kembalikan status gagal sehingga *controller/route* tahu ini tidak diizinkan (Unauthorized).
5. **Return Data:**
   - Jika berhasil, kembalikan objek data user dengan properti yang dibutuhkan (`id`, `name`, `email`, dan `created_at`). **Penting:** Pastikan field sensitif seperti `password` tidak ikut dikembalikan.

### 2. Buat/Update Route (`src/routes/users-route.ts`)
1. Buka file `src/routes/users-route.ts` (buat jika belum ada).
2. Definisikan endpoint `GET` pada path `/api/users/current` menggunakan instance ElysiaJS.
3. **Ekstrak Header:**
   - Di dalam handler endpoint, akses request header `authorization` (atau `Authorization`).
   - Validasi ketersediaan header. Jika tidak ada, kembalikan error `Unauthorized`.
   - String header biasanya berformat `Bearer <token>`. Lakukan parsing (misalnya dengan `.split(' ')[1]`) untuk mengekstrak string `<token>` aslinya saja.
4. **Panggil Service:**
   - Panggil function `getCurrentUser(token)` yang dibuat pada langkah 1.
5. **Format Response:**
   - Jika sukses: kembalikan objek JSON dengan format `{ "data": { ...data_user } }`.
   - Jika gagal/error (token tidak valid): gunakan `set.status = 401` untuk mengubah HTTP status code, lalu kembalikan JSON `{ "error": "Unauthorized" }`.

### 3. Daftarkan Route (`src/index.ts` atau file setup utama)
1. Jika file `users-route.ts` baru saja dibuat, pastikan ia di-export dengan benar (misalnya export default sebuah plugin Elysia).
2. Buka file entry point utama aplikasi (seperti `src/index.ts`).
3. Import route tersebut dan pasang ke instance utama (contoh: `app.use(usersRoute)`).

### 4. Pengujian / Testing
Silakan lakukan verifikasi secara lokal dengan menggunakan Postman, Insomnia, atau `curl`.
1. **Skenario 1 (Tanpa Header):** Hit endpoint `GET /api/users/current` tanpa menyertakan header `Authorization`. Ekspektasi: HTTP 401 dan response `{ "error": "Unauthorized" }`.
2. **Skenario 2 (Token Salah):** Hit endpoint dengan header `Authorization: Bearer tokensalah123`. Ekspektasi: HTTP 401 dan response `{ "error": "Unauthorized" }`.
3. **Skenario 3 (Token Benar):** Ambil token valid dari database tabel `sessions`, lalu hit endpoint dengan header `Authorization: Bearer <token_valid>`. Ekspektasi: HTTP 200 (OK) dan response berisi data user.
