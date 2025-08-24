'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Props interface for the update password card
interface UpdatePasswordCardProps {
  title?: string
  description?: string
  children: React.ReactNode
}

// Reusable card component for update password form
export function UpdatePasswordCard({ 
  title = 'Atur Ulang Kata Sandi',
  description = 'Silakan masukkan kata sandi baru Anda di bawah.',
  children 
}: UpdatePasswordCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}