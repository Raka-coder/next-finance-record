"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@supabase/supabase-js"
import { DataExportSection } from "./data-export-section"

interface DataManagementCardProps {
  user: User
}

export function DataManagementCard({ user }: DataManagementCardProps) {
  return (
    <Card className="border border-border bg-card p-5 gap-0">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight">Manajemen Data</CardTitle>
          <span className="text-[11px] font-mono text-muted-foreground uppercase">Ekspor</span>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Unduh catatan pembukuan transaksi dalam format berkas spreadsheet (.csv)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <DataExportSection user={user} />
      </CardContent>
    </Card>
  )
}