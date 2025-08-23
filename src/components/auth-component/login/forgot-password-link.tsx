import Link from "next/link"

export default function ForgotPasswordLink() {
    return (
        <div className="text-sm">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
                Lupa Password?
            </Link>
        </div>
    )
}
