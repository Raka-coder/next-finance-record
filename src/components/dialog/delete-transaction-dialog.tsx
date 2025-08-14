import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { LoadingButton } from "../ui/loading-button"

interface DeleteTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: () => void
  loading?: boolean
}

export function DeleteTransactionDialog({ open, onOpenChange, onDelete, loading }: DeleteTransactionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-orange-500" />
            Hapus Transaksi
            </DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={loading}>
            Batal
          </Button>
          <LoadingButton
            type="button"
            onClick={onDelete}
            loading={loading}
            loadingText="Menghapus..."
            className="bg-red-500 hover:bg-red-600 dark:text-white"
          >
            Hapus
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}