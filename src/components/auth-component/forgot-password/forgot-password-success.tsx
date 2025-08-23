'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function ForgotPasswordSuccess() {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle className="text-2xl">Check Your Email</CardTitle>
        <CardDescription>Password reset instructions sent</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          If you registered using your email and password, you will receive a password reset
          email.
        </p>
      </CardContent>
    </Card>
  )
}