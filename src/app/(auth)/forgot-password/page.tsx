import { ForgotPasswordForm } from "@/components/auth-component/forgot-password/forgot-password-form"
import { generatePublicPageMetadata } from "@/components/seo/public-page-seo"

export const metadata = generatePublicPageMetadata({
  title: "Lupa Password",
  description: "Atur ulang password akun FinanceRecord Anda.",
  path: "/forgot-password",
})

export default function page() {
  return (
    <div>
        <ForgotPasswordForm />
    </div>
  )
}
