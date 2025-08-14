import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="flex flex-col items-center gap-4">
        <span className="rounded-full bg-muted p-4">
          <Ghost className="h-12 w-12 text-muted-foreground" />
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-center">404 - Halaman Tidak Ditemukan</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Maaf, halaman yang Anda cari tidak ditemukan atau sudah dipindahkan.
        </p>
        <Link href="/">
          <Button variant="outline" size="default" className="mt-4">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}