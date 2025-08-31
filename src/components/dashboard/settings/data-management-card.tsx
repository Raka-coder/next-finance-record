"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@supabase/supabase-js"
import { DataExportSection } from "./data-export-section"
import { FileText } from "lucide-react"

interface DataManagementCardProps {
  user: User
}

export function DataManagementCard({ user }: DataManagementCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5"/>
          Manajemen Data</CardTitle>
        <CardDescription>
          Kelola dan ekspor data transaksi Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DataExportSection user={user} />
      </CardContent>
    </Card>
  )
}