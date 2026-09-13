"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { ThemeToggle } from "@/components/theme-toggle"
import { ProfileService } from "@/services/profile.service"
import type { Profile } from "@/interfaces/profile-interface"
import { LogoutDialog } from "@/components/dialog/logout-dialog"
import Link from "next/link"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"

interface UserMenuProps {
  profile: Profile | null
  onProfileUpdate: (updates: Partial<Profile>) => Promise<Profile | null>
  onProfileCreate?: (username: string, fullName?: string) => Promise<Profile | null>
  userEmail?: string
}

export function UserMenu({ profile, onProfileUpdate, onProfileCreate, userEmail }: UserMenuProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
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

  const router = useRouter()
  useAuth()

  const validateUsername = async (username: string, isCreate = false) => {
    if (username.length < 3) {
      setUsernameError("Username minimal 3 karakter")
      return false
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError("Hanya huruf, angka, dan underscore")
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

    const hasChanges = 
      editForm.username !== profile?.username || 
      editForm.full_name !== profile?.full_name

    if (!hasChanges) {
      toast.error("Tidak ada profil yang diubah")
      setLoading(false)
      return
    }

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
      toast.success("Profil diperbarui")
    } catch {
      toast.error("Gagal memperbarui profil")
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
        toast.success("Profil dibuat")
      }
    } catch {
      toast.error("Gagal membuat profil")
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

  if (!profile) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex flex-col items-end leading-none">
          <span className="text-xs font-mono text-muted-foreground">{userEmail || "User"}</span>
        </div>

        <ThemeToggle />

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="font-mono text-xs">
              + Buat Profil
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[380px]">
            <DialogHeader>
              <DialogTitle>Buat Profil</DialogTitle>
              <DialogDescription>Lengkapi nama dan nama pengguna Anda</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProfile} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="create-fullname" className="text-xs font-mono">Nama Lengkap</Label>
                <Input
                  id="create-fullname"
                  value={createForm.full_name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Nama Anda"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-username" className="text-xs font-mono">Username</Label>
                <Input
                  id="create-username"
                  value={createForm.username}
                  onChange={(e) => handleUsernameChange(e.target.value, true)}
                  placeholder="username"
                  required
                  minLength={3}
                />
                {usernameError && <p className="text-[11px] text-[#9F2F2D]">{usernameError}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" size="sm" disabled={loading || !!usernameError}>
                  {loading ? "Membuat..." : "Simpan"}
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
      <div className="hidden sm:flex flex-col items-end leading-tight">
        <span className="text-xs font-medium text-foreground">{profile.full_name || profile.username}</span>
        <span className="text-[10px] font-mono text-muted-foreground">@{profile.username}</span>
      </div>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative size-7 rounded-[4px] border border-border flex items-center justify-center overflow-hidden hover:opacity-85 transition-opacity cursor-pointer">
            <Avatar className="size-7 rounded-[3px]">
              <AvatarImage src={profile.avatar_url || ""} alt={profile.username} />
              <AvatarFallback className="bg-secondary text-foreground text-[10px] font-mono font-medium rounded-[3px]">
                {getInitials(profile.full_name || profile.username)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-0.5">
              <span className="text-xs font-medium text-foreground">{profile.full_name || profile.username}</span>
              <span className="text-[10px] font-mono text-muted-foreground">@{profile.username}</span>
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
                <span>Edit Profil</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[380px]">
              <DialogHeader>
                <DialogTitle>Edit Profil</DialogTitle>
                <DialogDescription>Perbarui nama dan username profil Anda.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpdateProfile} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="edit-fullname" className="text-xs font-mono">Nama Lengkap</Label>
                  <Input
                    id="edit-fullname"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Nama lengkap"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-username" className="text-xs font-mono">Username</Label>
                  <Input
                    id="edit-username"
                    value={editForm.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="username"
                    required
                    minLength={3}
                  />
                  {usernameError && <p className="text-[11px] text-[#9F2F2D]">{usernameError}</p>}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    size="sm"
                    disabled={loading || !!usernameError}
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="w-full">
              <span>Pengaturan</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <span>Keluar Akun</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutDialog 
        open={isLogoutDialogOpen} 
        onOpenChange={setIsLogoutDialogOpen}
        onLogoutSuccess={() => router.push("/login")}
      />
    </div>
  )
}