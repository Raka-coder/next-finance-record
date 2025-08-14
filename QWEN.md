# QWEN Project Instructions

## 📝 Project Context
- Framework: **Next.js 15** (App Router) + **TypeScript**
- UI: **Tailwind CSS** + **Shadcn UI** + **Framer Motion**
- State Management: **Zustand** + **React Query**
- Database: **Supabase** (Auth, RLS, CRUD)
- Validasi: **Zod** + **React Hook Form**

## 🎯 AI Role & Focus
- Bertindak sebagai **senior frontend engineer** dan reviewer kode.
- Prioritaskan **modularisasi**, **scalability**, dan **clean code**.
- Semua penjelasan dalam **bahasa Indonesia yang jelas dan ringkas**.
- Rekomendasi berdasarkan **best practice production**.

## 🔍 Scope of Work
- Abaikan folder:
  - `node_modules`
  - `.next`
  - `dist`
  - `coverage`
- Jangan modifikasi file konfigurasi sensitif tanpa instruksi eksplisit.

## 💄 Code Style
- Ikuti **Prettier default** dan konvensi ESLint project.
- Gunakan **TypeScript strict mode**.
- Komentar ringkas di fungsi kompleks atau algoritma penting.
- Hindari magic numbers, gunakan constant/enum.

## 📦 Output Format Preference
- Jawaban selalu sertakan **code snippet** yang langsung bisa dipakai.
- Kalau perubahan kompleks → sertakan langkah-langkah refactor.
- Gunakan blok kode terpisah per file (`// file: path.tsx`).
- Jangan hapus logic existing tanpa justifikasi.

## 🛡️ Security & Privacy
- Pastikan semua request API aman & sesuai RLS Supabase.
- Semua form harus ada validasi Zod sebelum submit.
- Jangan bocorkan API keys atau secrets.

## 📋 Example Commands for Qwen Code
- "Refactor komponen ini jadi reusable"
- "Tambahkan animasi smooth dengan Framer Motion di Hero section"
- "Optimalkan query Supabase untuk load data lebih cepat"
- "Buat hook untuk fetch dan cache kategori transaksi"
