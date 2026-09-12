"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { expenseCategories } from "@/components/dashboard/transaction/transaction-categories"
import { BudgetService } from "@/services/budget.service"
import { toast } from "sonner"
import type { BudgetInput } from "@/interfaces/budget-interface"

interface BudgetFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  month: string
  existingCategory?: string
  existingAmount?: number
  onSuccess: () => void
}

export function BudgetFormDialog({
  open,
  onOpenChange,
  month,
  existingCategory,
  existingAmount,
  onSuccess,
}: BudgetFormDialogProps) {
  const [category, setCategory] = useState(existingCategory || "")
  const [amount, setAmount] = useState(existingAmount ? String(existingAmount) : "")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) {
      toast.error("Pilih kategori pengeluaran")
      return
    }
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Batas anggaran harus lebih dari 0")
      return
    }

    try {
      setIsLoading(true)
      const input: BudgetInput = {
        category,
        amount: numAmount,
        month,
      }
      await BudgetService.upsertBudget(input)
      toast.success("Anggaran berhasil disimpan!")
      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan anggaran"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{existingCategory ? "Ubah Anggaran" : "Atur Batas Anggaran"}</DialogTitle>
          <DialogDescription>
            Tetapkan batas maksimal pengeluaran bulanan untuk kategori pilihan Anda.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="category">Kategori Pengeluaran</Label>
            <Select value={category} onValueChange={setCategory} disabled={!!existingCategory}>
              <SelectTrigger id="category" className="h-10 rounded-xl border-border/70">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {expenseCategories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="cursor-pointer rounded-lg">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Batas Anggaran (Rp)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Contoh: 1500000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-10 rounded-xl border-border/70 font-mono tabular-nums"
              min="1"
              required
            />
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="rounded-xl h-10">
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl h-10">
              {isLoading ? "Menyimpan..." : "Simpan Anggaran"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
