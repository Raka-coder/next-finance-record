"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoalService } from "@/services/goal.service"
import { toast } from "sonner"
import type { Goal, GoalInput } from "@/interfaces/budget-interface"

interface GoalFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingGoal?: Goal | null
  onSuccess: () => void
}

export function GoalFormDialog({ open, onOpenChange, existingGoal, onSuccess }: GoalFormDialogProps) {
  const [name, setName] = useState(existingGoal?.name || "")
  const [targetAmount, setTargetAmount] = useState(existingGoal ? String(existingGoal.target_amount) : "")
  const [currentAmount, setCurrentAmount] = useState(existingGoal ? String(existingGoal.current_amount) : "")
  const [targetDate, setTargetDate] = useState(existingGoal?.target_date || "")
  const [color, setColor] = useState(existingGoal?.color || "#10b981")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Nama target tidak boleh kosong")
      return
    }

    const targetNum = parseFloat(targetAmount)
    if (isNaN(targetNum) || targetNum <= 0) {
      toast.error("Target nominal harus lebih dari 0")
      return
    }

    const currentNum = currentAmount ? parseFloat(currentAmount) : 0

    try {
      setIsLoading(true)
      const input: GoalInput = {
        name: name.trim(),
        target_amount: targetNum,
        current_amount: currentNum,
        target_date: targetDate || null,
        color,
      }

      if (existingGoal) {
        await GoalService.updateGoal(existingGoal.id, input)
        toast.success("Target tabungan berhasil diperbarui!")
      } else {
        await GoalService.createGoal(input)
        toast.success("Target tabungan baru berhasil dibuat!")
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan target"
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{existingGoal ? "Ubah Target Tabungan" : "Buat Target Tabungan Baru"}</DialogTitle>
          <DialogDescription>
            Tetapkan tujuan impian finansial Anda (seperti Dana Darurat, Liburan, atau Kendaraan).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Impian / Target</Label>
            <Input
              id="name"
              placeholder="Contoh: Dana Darurat 6 Bulan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-xl border-border/70"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Nominal (Rp)</Label>
            <Input
              id="targetAmount"
              type="number"
              placeholder="Contoh: 15000000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="h-10 rounded-xl border-border/70 font-mono tabular-nums"
              min="1"
              required
            />
          </div>

          {!existingGoal && (
            <div className="space-y-2">
              <Label htmlFor="currentAmount">Saldo Awal Saat Ini (Opsional)</Label>
              <Input
                id="currentAmount"
                type="number"
                placeholder="Contoh: 2000000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="h-10 rounded-xl border-border/70 font-mono tabular-nums"
                min="0"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Tanggal Tercapai (Opsional)</Label>
            <Input
              id="targetDate"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="h-10 rounded-xl border-border/70"
            />
          </div>

          <div className="space-y-2">
            <Label>Warna Identitas Target</Label>
            <div className="flex gap-2.5 items-center pt-1">
              {["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`size-7 rounded-full transition-transform ${
                    color === c ? "ring-2 ring-offset-2 ring-primary scale-110" : "opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="rounded-xl h-10">
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl h-10">
              {isLoading ? "Menyimpan..." : "Simpan Target"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
