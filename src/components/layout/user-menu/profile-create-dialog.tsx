"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { profileSchema, ProfileSchema } from "@/validation/schemas/profile"
import { ProfileService } from "@/services/profile-service"
import type { Profile } from "@/types/profile-types"
import { toast } from "sonner"

interface ProfileCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileCreate?: (username: string, fullName?: string) => Promise<Profile | null>
}

export function ProfileCreateDialog({ open, onOpenChange, onProfileCreate }: ProfileCreateDialogProps) {
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState("")
  
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      username: "",
    },
    mode: "onChange",
  })

  // Reset form saat dialog dibuka
  useEffect(() => {
    if (open) {
      form.reset({ full_name: "", username: "" })
      setUsernameError("")
    }
  }, [open])

  const handleCreateProfile = async (values: ProfileSchema) => {
    setLoading(true)
    setUsernameError("")
    const isAvailable = await ProfileService.checkUsernameAvailability(values.username)
    if (!isAvailable) {
      setUsernameError("Username sudah digunakan")
      setLoading(false)
      return
    }
    if (onProfileCreate) {
      await onProfileCreate(values.username, values.full_name)
      onOpenChange(false)
      toast.message("Profil berhasil dibuat!")
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat Profile</DialogTitle>
          <DialogDescription>Buat profile Anda untuk melengkapi akun</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateProfile)} className="space-y-4">
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
                {loading ? "Membuat..." : "Buat Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}