"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LogoutDialog } from "@/components/dialog/logout-dialog"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { ShieldCheck, KeyRound, LogOut, CheckCircle2 } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface SecuritySettingsCardProps {
  user: User
}

export function SecuritySettingsCard({ user }: SecuritySettingsCardProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChanging, setIsChanging] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  // Check if provider includes google or social login
  const isGoogleUser = user.app_metadata?.provider === "google" ||
    (user as any).providers?.includes("google")

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi baru tidak cocok")
      return
    }

    setIsChanging(true)
    try {
      const res = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })

      if (res.error) {
        toast.error(res.error.message || "Gagal mengubah kata sandi")
        return
      }

      toast.success("Kata sandi berhasil diperbarui!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengubah kata sandi"
      toast.error(msg)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Password Change Card */}
      <Card className="border border-border bg-card p-5 gap-0 shadow-none rounded-md">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold tracking-tight">
                Kata Sandi Akun
              </CardTitle>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground uppercase">
              Keamanan
            </span>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Perbarui kata sandi untuk melindungi akses masuk ke buku kas Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          {isGoogleUser ? (
            <div className="p-4 rounded-[4px] border border-border bg-secondary/30 flex items-start gap-3">
              <CheckCircle2 className="size-4 text-[#346538] dark:text-[#81C784] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-foreground">
                  Masuk Menggunakan Akun Google
                </p>
                <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                  Akun Anda terhubung langsung dengan Google Single Sign-On (SSO). Manajemen kata sandi dan keamanan 2FA dikelola secara aman melalui Akun Google Anda.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="current-password" className="text-[11px] font-mono text-muted-foreground uppercase">
                  Kata Sandi Saat Ini
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="font-mono text-xs max-w-md"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="new-password" className="text-[11px] font-mono text-muted-foreground uppercase">
                    Kata Sandi Baru
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="font-mono text-xs"
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-[11px] font-mono text-muted-foreground uppercase">
                    Konfirmasi Kata Sandi Baru
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="font-mono text-xs"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isChanging || !currentPassword || !newPassword || !confirmPassword}
                  className="font-mono text-xs cursor-pointer"
                >
                  {isChanging ? "Menyimpan..." : "Perbarui Kata Sandi"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Sesi & Keluar Akun */}
      <Card className="border border-border bg-card p-5 gap-0 shadow-none rounded-md">
        <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
                Sesi Perangkat & Akses
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Kelola sesi aktif akun Anda di peramban ini atau akhiri sesi saat selesai menggunakan perangkat bersama
            </CardDescription>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsLogoutDialogOpen(true)}
            className="font-mono text-xs gap-1.5 cursor-pointer"
          >
            <LogOut className="size-3.5" />
            Keluar Akun
          </Button>
        </CardHeader>
      </Card>

      <LogoutDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      />
    </div>
  )
}
