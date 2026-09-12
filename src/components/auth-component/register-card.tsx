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
    <Card className="w-full max-w-[440px] shadow-sm border-border/70">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
            <Wallet className="size-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Buat Akun Baru</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Mulai catat dan kelola keuangan pribadi Anda dengan mudah
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <RegisterForm onRegisterSuccess={onRegisterSuccess || handleRegisterSuccess} />
      </CardContent>
    </Card>
  )
}