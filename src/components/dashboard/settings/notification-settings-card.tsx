"use client"

import { Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export function NotificationSettingsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="size-5" />
          Notifikasi
        </CardTitle>
        <CardDescription>Atur preferensi notifikasi Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifikasi Email</Label>
            <p className="text-sm text-muted-foreground">
              Terima notifikasi melalui email
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Pengingat Transaksi</Label>
            <p className="text-sm text-muted-foreground">
              Pengingat untuk mencatat transaksi harian
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Laporan Bulanan</Label>
            <p className="text-sm text-muted-foreground">
              Terima laporan keuangan bulanan
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  )
}