// Next.js Link component for client-side navigation
import Link from "next/link"

// Component for navigating to the login page
// Displays a styled link with hover effects
export default function LoginLink() {
  return (
    <Link href="/login" className="text-blue-600 hover:underline">
        Login
    </Link>
  )
}
