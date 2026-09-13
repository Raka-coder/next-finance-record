"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card className="w-full max-w-[400px] rounded-md border border-border bg-card p-6 gap-0">
      <CardHeader className="p-0 pb-6 text-left">
        <div className="flex items-center justify-between mb-4">
          <div className="size-7 rounded-[4px] bg-secondary border border-border flex items-center justify-center font-mono text-xs font-semibold text-foreground">
            FR
          </div>
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
            Daftar
          </span>
        </div>
        <CardTitle className="text-xl font-semibold tracking-tight">Buat Akun</CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          Mulai kelola arus kas harian dengan buku besar minimalis.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <RegisterForm onRegisterSuccess={onRegisterSuccess || handleRegisterSuccess} />
      </CardContent>
    </Card>
  )
}