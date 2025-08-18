"use client"

import { LogOut, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLogoutSuccess?: () => void
}

export function LogoutDialog({ open, onOpenChange, onLogoutSuccess }: LogoutDialogProps) {
  const { logout, logoutLoading, logoutError, clearLogoutError } = useAuth()

  const handleLogout = async () => {
    try {
      clearLogoutError()
      
      const result = await logout()
      
      if (result) {
        // Close dialog
        onOpenChange(false)
        toast.message("Logout berhasil!")
        
        // Call success callback if provided
        if (onLogoutSuccess) {
          onLogoutSuccess()
        }
      }
    } catch (err) {
      // Error handling is done in the hook, just show toast
      toast.error("Logout gagal!")
    }
  }

  const handleCancel = () => {
    if (!logoutLoading) {
      clearLogoutError()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95%] sm:max-w-[425px] mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-orange-500" />
            Konfirmasi Logout
          </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin keluar dari akun? Anda perlu masuk kembali untuk mengakses dashboard.
          </DialogDescription>
        </DialogHeader>

        {logoutError && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{logoutError}</p>
          </div>
        )}

        <DialogFooter className="flex items-center justify-center flex-row gap-2 sm:flex-row sm:gap-0 sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={logoutLoading}
            className="w-auto sm:w-auto cursor-pointer"
          >
            Batal
          </Button>
          <LoadingButton
            type="button"
            onClick={handleLogout}
            loading={logoutLoading}
            loadingText="Memproses..."
            className="w-auto sm:w-auto cursor-pointer bg-red-500 hover:bg-red-600 dark:text-white"
          >
            <LogOut className="size-4" />
            Ya, Keluar
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}