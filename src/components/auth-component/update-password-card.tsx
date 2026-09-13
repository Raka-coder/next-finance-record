'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface UpdatePasswordCardProps {
  title?: string
  description?: string
  children: React.ReactNode
}

export function UpdatePasswordCard({ 
  title = 'Sandi Baru',
  description = 'Masukkan kata sandi baru untuk akun Anda.',
  children 
}: UpdatePasswordCardProps) {
  return (
    <Card className="w-full max-w-[380px] rounded-md border border-border bg-card p-6 gap-0">
      <CardHeader className="p-0 pb-6 text-left">
        <div className="flex items-center justify-between mb-4">
          <div className="size-7 rounded-[4px] bg-secondary border border-border flex items-center justify-center font-mono text-xs font-semibold text-foreground">
            FR
          </div>
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
            Sandi
          </span>
        </div>
        <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  )
}