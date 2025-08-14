"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { supabase } from "@/utils/supabase/client"
import { ProfileService } from "@/services/profile-service"
import type { Profile } from "@/types/profile-types"
import { User, Settings, LogOut, Edit, UserPlus } from "lucide-react"

interface UserMenuProps {
  profile: Profile | null
  onProfileUpdate: (updates: Partial<Profile>) => Promise<Profile | null>
  onProfileCreate?: (username: string, fullName?: string) => Promise<Profile | null>
  userEmail?: string
}

export function UserMenu({ profile, onProfileUpdate, onProfileCreate, userEmail }: UserMenuProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    username: profile?.username || "",
    full_name: profile?.full_name || "",
  })
  const [createForm, setCreateForm] = useState({
    username: "",
    full_name: "",
  })
  const [usernameError, setUsernameError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert("Error signing out: " + error.message)
    }
  }

  const validateUsername = async (username: string, isCreate = false) => {
    if (username.length < 3) {
      setUsernameError("Username minimal 3 karakter")
      return false
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError("Username hanya boleh mengandung huruf, angka, dan underscore")
      return false
    }

    if (isCreate || username !== profile?.username) {
      const isAvailable = await ProfileService.checkUsernameAvailability(username, profile?.id)
      if (!isAvailable) {
        setUsernameError("Username sudah digunakan")
        return false
      }
    }

    setUsernameError("")
    return true
  }

  const handleUsernameChange = async (value: string, isCreate = false) => {
    if (isCreate) {
      setCreateForm((prev) => ({ ...prev, username: value }))
    } else {
      setEditForm((prev) => ({ ...prev, username: value }))
    }

    if (value.length >= 3) {
      await validateUsername(value, isCreate)
    } else {
      setUsernameError("")
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const isUsernameValid = await validateUsername(editForm.username)
      if (!isUsernameValid) {
        setLoading(false)
        return
      }

      await onProfileUpdate({
        username: editForm.username,
        full_name: editForm.full_name,
      })

      setIsEditDialogOpen(false)
      alert("Profil berhasil diperbarui!")
    } catch (error) {
      alert("Gagal memperbarui profil")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const isUsernameValid = await validateUsername(createForm.username, true)
      if (!isUsernameValid) {
        setLoading(false)
        return
      }

      if (onProfileCreate) {
        await onProfileCreate(createForm.username, createForm.full_name)
        setIsCreateDialogOpen(false)
        alert("Profil berhasil dibuat!")
      }
    } catch (error) {
      alert("Gagal membuat profil")
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Jika profile tidak ada, tampilkan tombol untuk membuat profile
  if (!profile) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium">{userEmail || "User"}</span>
          <Badge variant="outline" className="text-xs">
            Profile belum dibuat
          </Badge>
        </div>

        <ThemeToggle />

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <UserPlus className="size-4 mr-2" />
              Buat Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Buat Profile</DialogTitle>
              <DialogDescription>Buat profile Anda untuk melengkapi akun</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-fullname">Nama Lengkap</Label>
                <Input
                  id="create-fullname"
                  value={createForm.full_name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-username">Username</Label>
                <Input
                  id="create-username"
                  value={createForm.username}
                  onChange={(e) => handleUsernameChange(e.target.value, true)}
                  placeholder="Masukkan username"
                  required
                  minLength={3}
                />
                {usernameError && <p className="text-sm text-red-600">{usernameError}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={loading || !!usernameError}>
                  {loading ? "Membuat..." : "Buat Profile"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-sm font-medium">{profile.full_name || profile.username}</span>
        <Badge variant="secondary" className="text-xs">
          @{profile.username}
        </Badge>
      </div>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile.avatar_url || ""} alt={profile.username} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(profile.full_name || profile.username)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile.full_name || profile.username}</p>
              <p className="text-xs leading-none text-muted-foreground">@{profile.username}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setEditForm({
                    username: profile.username,
                    full_name: profile.full_name || "",
                  })
                  setIsEditDialogOpen(true)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Profil</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profil</DialogTitle>
                <DialogDescription>Perbarui informasi profil Anda di sini.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fullname">Nama Lengkap</Label>
                  <Input
                    id="edit-fullname"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    value={editForm.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="Masukkan username"
                    required
                    minLength={3}
                  />
                  {usernameError && <p className="text-sm text-red-600">{usernameError}</p>}
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={loading || !!usernameError}>
                    {loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Pengaturan</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
