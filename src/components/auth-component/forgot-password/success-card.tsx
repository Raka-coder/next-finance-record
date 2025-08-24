'use client'

// UI components for card layout
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Success component to display after a successful password reset request
// Shows a confirmation message to the user
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