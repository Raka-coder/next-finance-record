import Link from "next/link"

export function RegisterLink() {
  return (
    <div className="mt-4 text-center text-sm">
      Belum punya akun?{" "}
      <Link href="/register" className="text-blue-600 hover:underline">
        Daftar di sini
      </Link>
    </div>
  )
}