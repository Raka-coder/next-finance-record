"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { RegisterForm } from "./register/register-form"
import { useRouter } from "next/navigation"

interface RegisterCardProps {
  onRegisterSuccess?: () => void
}

export function RegisterCard({ onRegisterSuccess }: RegisterCardProps) {
  const router = useRouter()
  
  const handleRegisterSuccess = () => {
    setTimeout(() => {
      router.push("/login")
    }, 3000)
  }

  return (
    <Card className="max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-6" />
          </div>
        </div>
        <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
        <CardDescription>Register untuk mulai mengelola keuangan Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm onRegisterSuccess={onRegisterSuccess || handleRegisterSuccess} />
      </CardContent>
    </Card>
  )
}