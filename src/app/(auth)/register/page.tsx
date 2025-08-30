import { RegisterCard } from "@/components/auth-component/register-card"
import { generatePublicPageMetadata } from "@/components/seo/public-page-seo"

export const metadata = generatePublicPageMetadata({
  title: "Daftar",
  description: "Buat akun FinanceRecord baru untuk mulai mengelola keuangan Anda.",
  path: "/register",
})

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <RegisterCard />
    </div>
  )
}
