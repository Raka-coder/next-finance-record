import { LoginCard } from "@/components/auth-component/login-card"
import { generatePublicPageMetadata } from "@/components/seo/public-page-seo"

export const metadata = generatePublicPageMetadata({
  title: "Masuk",
  description: "Masuk ke akun FinanceRecord Anda untuk mengelola keuangan pribadi.",
  path: "/login",
})

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoginCard />
    </div>
  )
}
