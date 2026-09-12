'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'

interface UpdatePasswordCardProps {
  title?: string
  description?: string
  children: React.ReactNode
}

export function UpdatePasswordCard({ 
  title = 'Atur Ulang Kata Sandi',
  description = 'Silakan masukkan kata sandi baru Anda di bawah ini.',
  children 
}: UpdatePasswordCardProps) {
  return (
    <Card className="w-full max-w-[420px] shadow-sm border-border/70">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
            <ShieldCheck className="size-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription className="text-center text-muted-foreground text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {children}
      </CardContent>
    </Card>
  )
}