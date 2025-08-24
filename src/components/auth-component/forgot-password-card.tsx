'use client'

// UI components for card layout
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
// Custom footer component for the forgot password card
import { ForgotPasswordFooter } from './forgot-password/forgot-password-footer'

// Props interface for the ForgotPasswordCard component
interface ForgotPasswordCardProps {
  // Content to be displayed inside the card
  children: React.ReactNode
}

// Card component that wraps the forgot password form
// Displays a title, description, form content, and footer
export function ForgotPasswordCard({ children }: ForgotPasswordCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Atur Ulang Kata Sandi</CardTitle>
        <CardDescription className="text-center">
          Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
        <ForgotPasswordFooter />
      </CardContent>
    </Card>
  )
}