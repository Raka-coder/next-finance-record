"use client"

import { Palette, Sun, Moon, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

export function AppearanceSettingsCard() {
  const { theme, setTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="size-5" />
          Tampilan
        </CardTitle>
        <CardDescription>Sesuaikan tampilan aplikasi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Tema</Label>
          <Select
            value={theme}
            onValueChange={setTheme}
            defaultValue="system"
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Pilih tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light" onClick={() => setTheme("light")}>
                <div className="flex items-center">
                  <Sun className="mr-2 mt-0.5 h-4 w-4" />
                  <span>Terang</span>
                </div>
              </SelectItem>
              <SelectItem value="dark" onClick={() => setTheme("dark")}>
                <div className="flex items-center">
                  <Moon className="mr-2 mt-0.5 h-4 w-4" />
                  <span>Gelap</span>
                </div>
              </SelectItem>
              <SelectItem value="system" onClick={() => setTheme("system")}>
                <div className="flex items-center">
                  <Monitor className="mr-2 mt-0.5 h-4 w-4" />
                  <span>System</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}