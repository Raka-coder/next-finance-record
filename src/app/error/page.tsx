'use client'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <AlertTriangle className="size-10 text-red-500 mb-2" />
          <CardTitle className="text-center">Terjadi Kesalahan</CardTitle>
          <CardDescription className="text-center">
            Maaf, terjadi sesuatu yang tidak diinginkan.<br />
            Silakan coba lagi atau kembali ke halaman utama.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button className="w-full" onClick={() => router.refresh()}>
            Coba Lagi
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
            Kembali ke Beranda
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
