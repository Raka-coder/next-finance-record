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
    <Card className="w-full max-w-[420px] shadow-sm border-border/70">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
            <Wallet className="size-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Selamat Datang</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Masukkan email dan kata sandi untuk masuk ke akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <LoginForm onLoginSuccess={onLoginSuccess || handleLoginSuccess} />
      </CardContent>
    </Card>
  )
}