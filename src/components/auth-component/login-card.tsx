"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="w-full max-w-[380px] rounded-md border border-border bg-card p-6 gap-0">
      <CardHeader className="p-0 pb-6 text-left">
        <div className="flex items-center justify-between mb-4">
          <div className="size-7 rounded-[4px] bg-secondary border border-border flex items-center justify-center font-mono text-xs font-semibold text-foreground">
            FR
          </div>
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
            Auth
          </span>
        </div>
        <CardTitle className="text-xl font-semibold tracking-tight">Masuk ke Akun</CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          Masukkan kredensial Anda untuk mengakses catatan keuangan.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <LoginForm onLoginSuccess={onLoginSuccess || handleLoginSuccess} />
      </CardContent>
    </Card>
  )
}