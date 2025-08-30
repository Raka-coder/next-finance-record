import { UpdatePasswordForm } from "@/components/auth-component/update-password/update-password-form"
import { generatePublicPageMetadata } from "@/components/seo/public-page-seo"

export const metadata = generatePublicPageMetadata({
  title: "Update Password",
  description: "Atur password baru untuk akun FinanceRecord Anda.",
  path: "/update-password",
})

export default function page() {
  return (
    <div className="flex justify-center items-center min-h-screen">
        <UpdatePasswordForm />
    </div>
  )
}
