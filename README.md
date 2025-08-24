# FinanceRecord - Aplikasi Manajemen Keuangan

![Dashboard Screenshot](https://via.placeholder.com/800x400.png?text=Screenshot+Dashboard+FinanceRecord)

**FinanceRecord** adalah platform manajemen keuangan modern yang membantu Anda melacak pemasukan, pengeluaran, dan mencapai tujuan finansial dengan visualisasi data yang menarik dan keamanan tingkat lanjut.

## ✨ Fitur Utama

- **Manajemen Transaksi**: Catat pemasukan dan pengeluaran dengan mudah, lengkap dengan kategori.
- **Dashboard Interaktif**: Visualisasikan kondisi keuangan Anda melalui grafik dan bagan yang informatif.
- **Analisis Kategori**: Lihat distribusi pemasukan dan pengeluaran berdasarkan kategori teratas.
- **Keamanan Terjamin**: Dibangun di atas Supabase dengan *Row Level Security* untuk memastikan data Anda hanya dapat diakses oleh Anda.
- **Akses Multi-Platform**: Desain responsif memastikan pengalaman pengguna yang optimal di web, mobile, dan desktop.
- **Mode Terang & Gelap**: Tampilan yang nyaman di mata, kapan pun Anda menggunakannya.

## 🛠️ Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **Visualisasi Data**: [Highcharts](https://www.highcharts.com/)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/)


## 🚀 Memulai Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal Anda.

### Prasyarat

- [Node.js](https://nodejs.org/) (v18 atau lebih baru)
- [Docker](https://www.docker.com/products/docker-desktop/) & [Docker Compose](https://docs.docker.com/compose/)
- Akun [Supabase](https://supabase.com/)

### 1. Konfigurasi Supabase

1.  Buat proyek baru di Supabase.
2.  Di dalam SQL Editor, jalankan skrip berikut untuk membuat tabel `transactions`:
    ```sql
    CREATE TABLE transactions (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id UUID REFERENCES auth.users(id) NOT NULL,
      date TIMESTAMPTZ NOT NULL,
      description TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      type TEXT NOT NULL, -- 'income' or 'expense'
      category TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Aktifkan Row Level Security (RLS)
    ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

    -- Buat policy agar user hanya bisa melihat dan mengubah datanya sendiri
    CREATE POLICY "Enable access for authenticated users only"
    ON transactions
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);
    ```

### 2. Instalasi Lokal

1.  **Clone repository ini:**
    ```bash
    git clone https://github.com/username/project-next-docker.git
    cd project-next-docker
    ```

2.  **Buat file environment:**
    Buat file `.env.local` di root proyek dan isi dengan kredensial dari proyek Supabase Anda.
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Jalankan server development:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di http://localhost:3000.

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.

---

Dibuat dengan ❤️ untuk manajemen keuangan yang lebih baik.