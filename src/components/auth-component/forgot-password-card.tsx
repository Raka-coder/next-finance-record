'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ForgotPasswordFooter } from './forgot-password/forgot-password-footer'
import { KeyRound } from 'lucide-react'

interface ForgotPasswordCardProps {
  children: React.ReactNode
}

export function ForgotPasswordCard({ children }: ForgotPasswordCardProps) {
  return (
    <Card className="w-full max-w-[420px] shadow-sm border-border/70">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
            <KeyRound className="size-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Atur Ulang Kata Sandi</CardTitle>
        <CardDescription className="text-center text-muted-foreground text-sm">
          Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {children}
        <ForgotPasswordFooter />
      </CardContent>
    </Card>
  )
}