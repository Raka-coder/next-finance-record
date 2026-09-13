"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/interfaces/profile-interface"

interface ProfileSettingsCardProps {
  user: User
  profile?: Profile | null
}

export function ProfileSettingsCard({ user, profile = null }: ProfileSettingsCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card className="border border-border bg-card p-5 gap-0">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight">Profil Pengguna</CardTitle>
          <span className="text-[11px] font-mono text-muted-foreground uppercase">Akun</span>
        </div>
        <CardDescription className="text-xs text-muted-foreground">Informasi identitas akun dan mata uang dasar</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-2 space-y-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 rounded-[4px] border border-border">
            <AvatarImage
              src={profile?.avatar_url || ""}
              alt={profile?.username || ""}
            />
            <AvatarFallback className="bg-secondary text-foreground text-xs font-mono font-medium rounded-[4px]">
              {profile
                ? getInitials(profile.full_name || profile.username)
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {profile?.full_name || "Nama belum diatur"}
            </h3>
            <p className="text-xs font-mono text-muted-foreground">
              @{profile?.username || "username"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-[11px] font-mono text-muted-foreground uppercase">
              Nama Lengkap
            </Label>
            <Input
              id="name"
              placeholder="Nama lengkap"
              defaultValue={profile?.full_name || ""}
              disabled
              className="bg-muted/40 font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="username" className="text-[11px] font-mono text-muted-foreground uppercase">
              Username
            </Label>
            <Input
              id="username"
              placeholder="username"
              defaultValue={profile?.username || ""}
              disabled
              className="bg-muted/40 font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-[11px] font-mono text-muted-foreground uppercase">
            Alamat Email
          </Label>
          <Input
            id="email"
            type="email"
            defaultValue={user.email || ""}
            disabled
            className="bg-muted/40 font-mono text-xs"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="currency" className="text-[11px] font-mono text-muted-foreground uppercase">
            Mata Uang Basis
          </Label>
          <Select defaultValue="IDR">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Pilih mata uang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IDR" className="font-mono text-xs">Rupiah Indonesia (IDR)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}