# FinanceRecord

Aplikasi manajemen keuangan pribadi berbasis web untuk pencatatan transaksi, anggaran, target tabungan, dan analisis arus kas.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Radix UI, Lucide Icons
- **Authentication**: Better Auth, Google OAuth
- **Database & Backend**: Supabase (PostgreSQL with Row Level Security)
- **Database Client**: node-postgres (`pg`) with Supabase Transaction/Session Pooler
- **Data Visualization**: Highcharts, Recharts
- **Form & Validation**: React Hook Form, Zod
- **Runtime / Package Manager**: Bun (recommended) / Node.js (v20+)

---

## Struktur Direktori

```text
next-finance-record/
├── src/
│   ├── app/                               # Next.js App Router
│   │   ├── (auth)/                        # Route autentikasi (login, register, forgot-password)
│   │   ├── (dashboard)/                   # Route dashboard dan modul aplikasi
│   │   │   └── dashboard/
│   │   │       ├── add-transaction/       # Form pencatatan transaksi
│   │   │       ├── budgets-goals/         # Anggaran bulanan & target finansial
│   │   │       ├── recurring/             # Transaksi berulang otomatis
│   │   │       ├── settings/              # Profil, kategori, dan keamanan
│   │   │       └── transaction-lists/     # Daftar & filter riwayat transaksi
│   │   └── api/                           # Endpoint API internal
│   │       ├── auth/                      # Better Auth handler & sinkronisasi token Supabase
│   │       └── export/                    # Ekspor laporan transaksi (CSV)
│   ├── components/                        # Komponen UI modular
│   │   ├── auth-component/                # Form autentikasi
│   │   ├── dashboard/                     # Widget, kartu statistik, dan chart
│   │   ├── layout/                        # Sidebar, navigation bar, dan user menu
│   │   └── ui/                            # Primitif UI (shadcn / Radix UI)
│   ├── hooks/                             # Custom React hooks (useAuth, useProfile, useTransactions, dll.)
│   ├── interfaces/                        # Definisi tipe data TypeScript
│   ├── lib/                               # Konfigurasi Better Auth (server & client)
│   ├── services/                          # Layer integrasi database & business logic
│   ├── sql/                               # Skema tabel SQL utama
│   └── utils/                             # Supabase client dan utility functions
├── supabase/
│   └── migrations/                        # Skrip migrasi database
├── .env.example                           # Contoh konfigurasi environment
├── package.json                           # Dependensi dan skrip proyek
└── tsconfig.json                          # Konfigurasi TypeScript
```

---

## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Raka-coder/next-finance-record.git
cd next-finance-record
```

### 2. Install Dependensi

Menggunakan Bun:

```bash
bun install
```

Atau menggunakan npm:

```bash
npm install
```

### 3. Konfigurasi Environment

Salin file `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Sesuaikan nilai variabel lingkungan berikut:

```env
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<supabase-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<supabase-service-role-key>"

BETTER_AUTH_SECRET="<better-auth-secret>"
BETTER_AUTH_URL="http://localhost:3000"

DATABASE_URL="postgres://postgres.<project-ref>:<db-password>@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

GOOGLE_CLIENT_ID="<google-client-id>"
GOOGLE_CLIENT_SECRET="<google-client-secret>"
```

### 4. Setup Database

Jalankan skrip SQL berikut pada Supabase SQL Editor:

1. `src/sql/create-profile.sql` (Tabel profil pengguna)
2. `src/sql/create-transacton.sql` (Tabel transaksi keuangan)
3. `supabase/migrations/20260912_feature_expansion.sql` (Tabel anggaran, target tabungan, dan jadwal berulang)

---

## Skrip

| Perintah | Deskripsi |
| --- | --- |
| `bun run dev` | Menjalankan server development Next.js (Turbopack) di `http://localhost:3000` |
| `bun run build` | Menjalankan pengecekan TypeScript dan kompilasi build produksi |
| `bun run start` | Menjalankan server aplikasi dari hasil build produksi |
| `bun run lint` | Menjalankan linter ESLint |