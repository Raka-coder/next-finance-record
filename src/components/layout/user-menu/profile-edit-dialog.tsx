"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { isEqual } from "lodash"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { profileSchema, ProfileSchema } from "@/validation/schemas/profile"
import { ProfileService } from "@/services/profile.service"
import type { Profile } from "@/interfaces/profile-interface"
import { toast } from "sonner"

interface ProfileEditDialogProps {
  profile: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileUpdate: (updates: Partial<Profile>) => Promise<Profile | null>
}

export function ProfileEditDialog({ profile, open, onOpenChange, onProfileUpdate }: ProfileEditDialogProps) {
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      username: profile?.username || "",
    },
    mode: "onChange",
  })

  // Tambahkan state untuk menyimpan nilai awal profile
  const [initialProfile, setInitialProfile] = useState({
    full_name: profile?.full_name || "",
    username: profile?.username || "",
  })

  // Reset form saat dialog dibuka
  useEffect(() => {
    if (open && profile) {
      const initial = {
        full_name: profile.full_name || "",
        username: profile.username || "",
      }
      form.reset(initial)
      setInitialProfile(initial)
      setUsernameError("")
    }
  }, [open, profile, form])

  // Cek apakah form berubah
  const isFormChanged = !isEqual(form.watch(), initialProfile)

  // Validasi username unik (async) saat submit
  const handleUpdateProfile = async (values: ProfileSchema) => {
    if (!isFormChanged) {
      toast.error("Profil tidak ada yang diubah")
      return
    }
    setLoading(true)
    setUsernameError("")
    const isAvailable = await ProfileService.checkUsernameAvailability(values.username, profile?.id)
    if (!isAvailable && values.username !== profile?.username) {
      setUsernameError("Username sudah digunakan")
      setLoading(false)
      return
    }
    await onProfileUpdate(values)
    onOpenChange(false)
    toast.success("Profil berhasil diperbarui!")
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
          <DialogDescription>Perbarui informasi profil Anda di sini.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-4">
            <FormField 
              name="full_name" 
              control={form.control} 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
            <FormField 
              name="username" 
              control={form.control} 
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan username" {...field} />
                  </FormControl>
                  <FormMessage />
                  {usernameError && <p className="text-sm text-red-600">{usernameError}</p>}
                </FormItem>
              )} 
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={loading || !!usernameError}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}