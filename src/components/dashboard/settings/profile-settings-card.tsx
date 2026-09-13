"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ProfileService } from "@/services/profile.service"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/interfaces/profile-interface"

interface ProfileSettingsCardProps {
  user: User
  profile?: Profile | null
  onProfileUpdate?: () => void
}

export function ProfileSettingsCard({ user, profile = null, onProfileUpdate }: ProfileSettingsCardProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [usernameError, setUsernameError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
      setUsername(profile.username || "")
    }
  }, [profile])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const validateUsername = async (val: string) => {
    const cleanVal = val.trim()
    if (cleanVal.length < 3) {
      setUsernameError("Username minimal 3 karakter")
      return false
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleanVal)) {
      setUsernameError("Hanya boleh berisi huruf, angka, dan garis bawah (_)")
      return false
    }

    if (cleanVal !== profile?.username) {
      const isAvailable = await ProfileService.checkUsernameAvailability(cleanVal, user.id)
      if (!isAvailable) {
        setUsernameError("Username ini sudah digunakan akun lain")
        return false
      }
    }

    setUsernameError("")
    return true
  }

  const handleUsernameChange = async (val: string) => {
    setUsername(val)
    if (val.trim().length >= 3) {
      await validateUsername(val)
    } else {
      setUsernameError("")
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanName = fullName.trim()
    const cleanUsername = username.trim().toLowerCase()

    const isChanged =
      cleanName !== (profile?.full_name || "") ||
      cleanUsername !== (profile?.username || "")

    if (!isChanged) {
      toast.info("Tidak ada perubahan profil untuk disimpan")
      return
    }

    setIsSaving(true)
    try {
      const isValid = await validateUsername(cleanUsername)
      if (!isValid) {
        setIsSaving(false)
        return
      }

      if (!profile) {
        await ProfileService.createProfile(user.id, cleanUsername, cleanName)
      } else {
        await ProfileService.updateProfile(user.id, {
          full_name: cleanName,
          username: cleanUsername,
        })
      }

      toast.success("Profil berhasil diperbarui!")
      if (onProfileUpdate) {
        onProfileUpdate()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui profil"
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const currentDisplayName = profile?.full_name || profile?.username || user.email?.split("@")[0] || "User"

  return (
    <Card className="border border-border bg-card p-5 gap-0 shadow-none rounded-md">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight">Profil Pengguna</CardTitle>
          <span className="text-[11px] font-mono text-muted-foreground uppercase">Akun</span>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Kelola nama tampilan dan nama pengguna identitas akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-[4px] border border-border">
              <AvatarImage
                src={profile?.avatar_url || ""}
                alt={currentDisplayName}
              />
              <AvatarFallback className="bg-secondary text-foreground text-xs font-mono font-medium rounded-[4px]">
                {getInitials(currentDisplayName)}
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
            <div className="space-y-1.5">
              <Label htmlFor="fullname" className="text-[11px] font-mono text-muted-foreground uppercase">
                Nama Lengkap
              </Label>
              <Input
                id="fullname"
                placeholder="Nama lengkap Anda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-[11px] font-mono text-muted-foreground uppercase">
                Username
              </Label>
              <Input
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className="font-mono text-xs"
                required
                minLength={3}
              />
              {usernameError && <p className="text-[11px] text-[#9F2F2D] mt-1">{usernameError}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[11px] font-mono text-muted-foreground uppercase">
              Alamat Email Terdaftar
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue={user.email || ""}
              disabled
              className="bg-muted/40 font-mono text-xs"
            />
            <p className="text-[11px] font-mono text-muted-foreground">
              Email terikat secara permanen pada sesi akun ini.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              size="sm"
              disabled={isSaving || !!usernameError}
              className="font-mono text-xs cursor-pointer"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}