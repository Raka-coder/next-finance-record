"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { RecurringService } from "@/services/recurring.service"
import { useCategories } from "@/hooks/use-categories"
import { toast } from "sonner"
import type { RecurringSchedule, RecurringScheduleInput, RecurringFrequency } from "@/interfaces/recurring-interface"

interface RecurringFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingSchedule?: RecurringSchedule | null
  onSuccess: () => void
}

export function RecurringFormDialog({
  open,
  onOpenChange,
  existingSchedule,
  onSuccess,
}: RecurringFormDialogProps) {
  const { incomeCategories, expenseCategories } = useCategories()
  const [description, setDescription] = useState(existingSchedule?.description || "")
  const [amount, setAmount] = useState(existingSchedule ? String(existingSchedule.amount) : "")
  const [type, setType] = useState<"income" | "expense">(existingSchedule?.type || "expense")
  const [category, setCategory] = useState(existingSchedule?.category || "")
  const [frequency, setFrequency] = useState<RecurringFrequency>(existingSchedule?.frequency || "monthly")
  const [nextDueDate, setNextDueDate] = useState(
    existingSchedule?.next_due_date || new Date().toISOString().split("T")[0]
  )
  const [isLoading, setIsLoading] = useState(false)

  const categories = type === "income" ? incomeCategories : expenseCategories

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim()) {
      toast.error("Nama transaksi/tagihan tidak boleh kosong")
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Nominal transaksi harus lebih besar dari 0")
      return
    }

    if (!category) {
      toast.error("Pilih kategori transaksi")
      return
    }

    if (!nextDueDate) {
      toast.error("Tentukan tanggal jatuh tempo")
      return
    }

    try {
      setIsLoading(true)
      const input: RecurringScheduleInput = {
        description: description.trim(),
        amount: numAmount,
        type,
        category,
        frequency,
        next_due_date: nextDueDate,
      }

      if (existingSchedule) {
        await RecurringService.updateSchedule(existingSchedule.id, input)
        toast.success("Jadwal transaksi berulang berhasil diperbarui!")
      } else {
        await RecurringService.createSchedule(input)
        toast.success("Jadwal transaksi berulang baru berhasil ditambahkan!")
      }

      onSuccess()
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan jadwal transaksi"
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{existingSchedule ? "Ubah Jadwal Transaksi" : "Tambah Transaksi Berulang"}</DialogTitle>
          <DialogDescription>
            Jadwalkan tagihan rutin seperti sewa, cicilan, langganan aplikasi, atau gaji bulanan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Tipe Transaksi */}
          <div className="space-y-2">
            <Label>Jenis Transaksi</Label>
            <RadioGroup
              value={type}
              onValueChange={(val) => {
                setType(val as "income" | "expense")
                setCategory("") // Reset category when type changes
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="r-expense" />
                <Label htmlFor="r-expense" className="cursor-pointer text-sm">
                  Pengeluaran Rutin
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="r-income" />
                <Label htmlFor="r-income" className="cursor-pointer text-sm">
                  Pemasukan Rutin
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description">Nama Tagihan / Transaksi</Label>
            <Input
              id="description"
              placeholder="Contoh: Tagihan WiFi Indihome, Netflix, Gaji Kantor"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-10 rounded-xl border-border/70"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Nominal */}
            <div className="space-y-2">
              <Label htmlFor="amount">Nominal (Rp)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Contoh: 350000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10 rounded-xl border-border/70 font-mono tabular-nums"
                min="1"
                required
              />
            </div>

            {/* Kategori */}
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="h-10 rounded-xl border-border/70">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {categories.map((c) => (
                    <SelectItem key={c} value={c} className="rounded-lg">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Frekuensi */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Frekuensi Pengulangan</Label>
              <Select
                value={frequency}
                onValueChange={(val) => setFrequency(val as RecurringFrequency)}
              >
                <SelectTrigger id="frequency" className="h-10 rounded-xl border-border/70">
                  <SelectValue placeholder="Pilih frekuensi" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="daily" className="rounded-lg">Harian</SelectItem>
                  <SelectItem value="weekly" className="rounded-lg">Mingguan</SelectItem>
                  <SelectItem value="monthly" className="rounded-lg">Bulanan</SelectItem>
                  <SelectItem value="yearly" className="rounded-lg">Tahunan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tanggal Jatuh Tempo */}
            <div className="space-y-2">
              <Label htmlFor="nextDueDate">Jatuh Tempo Berikutnya</Label>
              <Input
                id="nextDueDate"
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="h-10 rounded-xl border-border/70"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="rounded-xl h-10">
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl h-10">
              {isLoading ? "Menyimpan..." : "Simpan Jadwal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
