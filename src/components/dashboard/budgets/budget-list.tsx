"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit2, Trash2, AlertTriangle, CheckCircle2, AlertOctagon } from "lucide-react"
import { BudgetService } from "@/services/budget.service"
import { BudgetFormDialog } from "./budget-form-dialog"
import { toast } from "sonner"
import type { BudgetProgress } from "@/interfaces/budget-interface"

interface BudgetListProps {
  month: string
  progressList: BudgetProgress[]
  isLoading: boolean
  onRefresh: () => void
}

export function BudgetList({ month, progressList, isLoading, onRefresh }: BudgetListProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<{ category: string; amount: number } | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    if (!confirm("Apakah Anda yakin ingin menghapus batasan anggaran untuk kategori ini?")) return

    try {
      await BudgetService.deleteBudget(id)
      toast.success("Anggaran berhasil dihapus")
      onRefresh()
    } catch {
      toast.error("Gagal menghapus anggaran")
    }
  }

  const handleOpenEdit = (item: BudgetProgress) => {
    setEditingBudget({ category: item.category, amount: item.budgeted })
    setDialogOpen(true)
  }

  const handleOpenCreate = () => {
    setEditingBudget(null)
    setDialogOpen(true)
  }

  const totalBudgeted = progressList.reduce((acc, curr) => acc + curr.budgeted, 0)
  const totalSpent = progressList.reduce((acc, curr) => acc + curr.spent, 0)
  const totalPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Top summary card */}
      <Card className="border-border/70 rounded-2xl bg-card/75 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-medium">Ringkasan Anggaran Bulanan</CardTitle>
            <CardDescription>Status pemakaian anggaran aktif pada periode {month}</CardDescription>
          </div>
          <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 rounded-xl h-9">
            <Plus className="size-4" />
            Atur Anggaran Baru
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl border border-border/50 bg-muted/25">
              <span className="text-xs text-muted-foreground font-medium">Total Anggaran Dialokasikan</span>
              <p className="text-xl font-bold font-mono tabular-nums text-foreground mt-1">
                {formatCurrency(totalBudgeted)}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/50 bg-muted/25">
              <span className="text-xs text-muted-foreground font-medium">Total Realisasi Belanja</span>
              <p className="text-xl font-bold font-mono tabular-nums text-foreground mt-1">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-border/50 bg-muted/25">
              <span className="text-xs text-muted-foreground font-medium">Sisa Batas Bersih</span>
              <p
                className={`text-xl font-bold font-mono tabular-nums mt-1 ${
                  totalBudgeted - totalSpent < 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {formatCurrency(totalBudgeted - totalSpent)}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-muted-foreground font-mono tabular-nums">
              <span>Keseluruhan Terpakai ({totalPercentage}%)</span>
              <span>{formatCurrency(totalSpent)} / {formatCurrency(totalBudgeted)}</span>
            </div>
            <Progress
              value={Math.min(100, totalPercentage)}
              className={`h-2.5 ${
                totalPercentage > 100
                  ? "[&>div]:bg-rose-500"
                  : totalPercentage >= 80
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-emerald-500"
              }`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid of category budgets */}
      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Memuat data anggaran...</div>
      ) : progressList.length === 0 ? (
        <Card className="border-dashed border-2 rounded-2xl py-12 text-center">
          <CardContent className="space-y-3">
            <div className="mx-auto size-12 rounded-xl bg-muted flex items-center justify-center">
              <AlertTriangle className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Belum Ada Anggaran untuk Bulan Ini</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Tentukan batasan anggaran per kategori untuk mengontrol pengeluaran Anda agar tidak melebihi rencana.
            </p>
            <Button onClick={handleOpenCreate} variant="outline" className="mt-2 rounded-xl">
              Mulai Buat Anggaran
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {progressList.map((item) => {
            const isOver = item.isOver
            const isWarning = item.isWarning

            return (
              <Card
                key={item.category}
                className={`relative overflow-hidden rounded-2xl border transition-all ${
                  isOver
                    ? "border-rose-500/40 bg-rose-500/[0.02]"
                    : isWarning
                    ? "border-amber-500/40 bg-amber-500/[0.02]"
                    : "border-border/70 bg-card/75 backdrop-blur-sm hover:border-border"
                }`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">{item.category}</CardTitle>
                      {isOver ? (
                        <Badge variant="destructive" className="gap-1 text-[11px] font-normal py-0 px-2 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                          <AlertOctagon className="size-3" />
                          Overbudget
                        </Badge>
                      ) : isWarning ? (
                        <Badge className="gap-1 text-[11px] font-normal py-0 px-2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          <AlertTriangle className="size-3" />
                          Mendekati Limit
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-[11px] font-normal py-0 px-2 rounded-full text-muted-foreground border-border/70 bg-muted/40">
                          <CheckCircle2 className="size-3 text-muted-foreground" />
                          Aman
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      Target Bulanan: <span className="font-mono tabular-nums font-medium text-foreground">{formatCurrency(item.budgeted)}</span>
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-rose-500"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono tabular-nums">
                      <span className="text-muted-foreground">Terpakai: {formatCurrency(item.spent)}</span>
                      <span className={`font-semibold ${isOver ? "text-rose-500" : isWarning ? "text-amber-500" : "text-foreground"}`}>
                        {item.percentage}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, item.percentage)}
                      className={`h-2 ${
                        isOver
                          ? "[&>div]:bg-rose-500"
                          : isWarning
                          ? "[&>div]:bg-amber-500"
                          : "[&>div]:bg-emerald-500"
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                    <span className="text-muted-foreground">Sisa Alokasi:</span>
                    <span
                      className={`font-mono tabular-nums font-semibold ${
                        item.remaining < 0 ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {item.remaining < 0 ? `-${formatCurrency(Math.abs(item.remaining))}` : formatCurrency(item.remaining)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {dialogOpen && (
        <BudgetFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          month={month}
          existingCategory={editingBudget?.category}
          existingAmount={editingBudget?.amount}
          onSuccess={onRefresh}
        />
      )}
    </div>
  )
}
