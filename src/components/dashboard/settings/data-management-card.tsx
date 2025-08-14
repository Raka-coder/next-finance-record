"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User } from "@supabase/supabase-js"
import { DataExportSection } from "./data-export-section"

interface DataManagementCardProps {
  user: User
}

export function DataManagementCard({ user }: DataManagementCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manajemen Data</CardTitle>
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