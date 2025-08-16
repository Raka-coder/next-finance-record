import Link from "next/link"

export function LoginLink() {
  return (
    <div className="mt-4 text-center text-sm">
      Sudah punya akun?{" "}
      <Link href="/login" className="text-blue-600 hover:underline">
        Login
      </Link>
    </div>
  )
}