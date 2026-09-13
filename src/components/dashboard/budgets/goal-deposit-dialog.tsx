"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoalService } from "@/services/goal.service"
import { toast } from "sonner"
import type { Goal } from "@/interfaces/budget-interface"

interface GoalDepositDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: Goal
  onSuccess: () => void
}

export function GoalDepositDialog({ open, onOpenChange, goal, onSuccess }: GoalDepositDialogProps) {
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseFloat(amount)
    if (isNaN(num) || num <= 0) {
      toast.error("Nominal harus lebih besar dari 0")
      return
    }

    const delta = mode === "deposit" ? num : -num

    if (mode === "withdraw" && num > goal.current_amount) {
      toast.error("Saldo tabungan tidak mencukupi untuk ditarik")
      return
    }

    try {
      setIsLoading(true)
      await GoalService.updateGoalProgress(goal.id, delta)
      toast.success(mode === "deposit" ? "Berhasil menabung!" : "Berhasil menarik alokasi!")
      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memperbarui saldo target"
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Kelola Saldo Target</DialogTitle>
          <DialogDescription>
            Ubah akumulasi tabungan untuk target <span className="font-semibold text-foreground">&quot;{goal.name}&quot;</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="flex rounded-xl bg-muted/60 p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode("deposit")}
              className={`flex-1 text-xs py-2 font-medium rounded-lg transition-all cursor-pointer ${
                mode === "deposit" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              + Tambah Tabungan
            </button>
            <button
              type="button"
              onClick={() => setMode("withdraw")}
              className={`flex-1 text-xs py-2 font-medium rounded-lg transition-all cursor-pointer ${
                mode === "withdraw" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              - Tarik Alokasi
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Nominal (Rp)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Contoh: 500000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-10 rounded-xl border-border/70 font-mono tabular-nums"
              min="1"
              required
            />
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="rounded-xl h-10">
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl h-10">
              {isLoading ? "Memproses..." : mode === "deposit" ? "Simpan Tabungan" : "Tarik Tabungan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
