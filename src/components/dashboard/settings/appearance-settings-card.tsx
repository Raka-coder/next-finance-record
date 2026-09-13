"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

export function AppearanceSettingsCard() {
  const { theme, setTheme } = useTheme()

  return (
    <Card className="border border-border bg-card p-5 gap-0">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight">Preferensi Visual</CardTitle>
          <span className="text-[11px] font-mono text-muted-foreground uppercase">Tema</span>
        </div>
        <CardDescription className="text-xs text-muted-foreground">Sesuaikan skema warna antarmuka (terang, gelap, atau sinkron sistem)</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-2 space-y-4">
        <div className="space-y-1">
          <Label className="text-[11px] font-mono text-muted-foreground uppercase">
            Mode Tampilan
          </Label>
          <Select
            value={theme}
            onValueChange={setTheme}
            defaultValue="system"
          >
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Pilih tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light" className="font-mono text-xs">
                Terang (Warm Bone)
              </SelectItem>
              <SelectItem value="dark" className="font-mono text-xs">
                Gelap (Obsidian)
              </SelectItem>
              <SelectItem value="system" className="font-mono text-xs">
                Sistem Operasi
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}