'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ForgotPasswordFooter } from './forgot-password-footer'

interface ForgotPasswordCardProps {
  children: React.ReactNode
}

export function ForgotPasswordCard({ children }: ForgotPasswordCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Reset Your Password</CardTitle>
        <CardDescription>
          Type in your email and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
        <ForgotPasswordFooter />
      </CardContent>
    </Card>
  )
}