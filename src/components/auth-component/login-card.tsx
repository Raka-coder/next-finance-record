"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { LoginForm } from "./login/login-form"
import { useRouter } from "next/navigation"

interface LoginCardProps {
  onLoginSuccess?: () => void
}

export function LoginCard({ onLoginSuccess }: LoginCardProps) {
  const router = useRouter()
  
  const handleLoginSuccess = () => {
    router.push("/dashboard")
  }

  return (
    <Card className="max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-6" />
          </div>
        </div>
        <CardTitle className="text-2xl">Masuk ke Akun</CardTitle>
        <CardDescription>Masukkan email dan password untuk login</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm onLoginSuccess={onLoginSuccess || handleLoginSuccess} />
      </CardContent>
    </Card>
  )
}