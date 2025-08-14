"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserIcon } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/profile-types"

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="size-5" />
          Profil Pengguna
        </CardTitle>
        <CardDescription>Kelola informasi profil Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={profile?.avatar_url || ""}
              alt={profile?.username || ""}
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {profile
                ? getInitials(profile.full_name || profile.username)
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-lg font-medium">
              {profile?.full_name || "Nama belum diatur"}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{profile?.username || "username"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              placeholder="Masukkan nama lengkap"
              defaultValue={profile?.full_name || ""}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="username"
              defaultValue={profile?.username || ""}
              disabled
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            defaultValue={user.email || ""}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Mata Uang Default</Label>
          <Select defaultValue="IDR">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Pilih mata uang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IDR">Rupiah (IDR)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}