'use client'

import { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <AlertTriangle className="size-10 text-red-500 mb-2" />
          <CardTitle className="text-center">Terjadi Kesalahan</CardTitle>
          <CardDescription className="text-center">
            Maaf, terjadi kesalahan pada aplikasi.<br />
            Silakan coba lagi atau kembali ke beranda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button className="w-full" onClick={() => reset()}>
            Coba Lagi
          </Button>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Kembali ke Beranda
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
