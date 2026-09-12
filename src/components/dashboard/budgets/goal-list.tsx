"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Target, Calendar, Edit2, Trash2, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { GoalService } from "@/services/goal.service"
import { GoalFormDialog } from "./goal-form-dialog"
import { GoalDepositDialog } from "./goal-deposit-dialog"
import { toast } from "sonner"
import type { Goal } from "@/interfaces/budget-interface"

interface GoalListProps {
  goals: Goal[]
  isLoading: boolean
  onRefresh: () => void
}

export function GoalList({ goals, isLoading, onRefresh }: GoalListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [depositOpen, setDepositOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus target tabungan ini?")) return

    try {
      await GoalService.deleteGoal(id)
      toast.success("Target tabungan berhasil dihapus")
      onRefresh()
    } catch {
      toast.error("Gagal menghapus target tabungan")
    }
  }

  const handleOpenEdit = (goal: Goal) => {
    setSelectedGoal(goal)
    setFormOpen(true)
  }

  const handleOpenDeposit = (goal: Goal) => {
    setSelectedGoal(goal)
    setDepositOpen(true)
  }

  const handleOpenCreate = () => {
    setSelectedGoal(null)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Target Finansial & Impian</h2>
          <p className="text-sm text-muted-foreground">
            Lacak kemajuan tabungan Anda untuk masa depan yang lebih terencana.
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5 self-start sm:self-auto">
          <Plus className="size-4" />
          Buat Target Baru
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Memuat data target tabungan...</div>
      ) : goals.length === 0 ? (
        <Card className="border-dashed py-12 text-center">
          <CardContent className="space-y-3">
            <div className="mx-auto size-12 rounded-full bg-muted flex items-center justify-center">
              <Target className="size-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Belum Ada Target Tabungan</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Miliki tujuan finansial yang jelas seperti tabungan rumah, dana darurat, atau liburan keluarga.
            </p>
            <Button onClick={handleOpenCreate} variant="outline" className="mt-2">
              Tambah Target Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const current = Number(goal.current_amount)
            const target = Number(goal.target_amount)
            const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
            const isCompleted = current >= target

            return (
              <Card
                key={goal.id}
                className="relative overflow-hidden border border-border/60 hover:border-border transition-all flex flex-col justify-between shadow-sm"
              >
                {/* Accent indicator stripe */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: goal.color || "#10b981" }}
                />

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        {goal.name}
                        {isCompleted && (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 text-[11px] py-0">
                            <CheckCircle2 className="size-3" /> Tercapai
                          </Badge>
                        )}
                      </CardTitle>
                      {goal.target_date && (
                        <CardDescription className="flex items-center gap-1.5 text-xs">
                          <Calendar className="size-3.5 text-muted-foreground" />
                          Target: {new Date(goal.target_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </CardDescription>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenEdit(goal)}
                      >
                        <Edit2 className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-rose-500"
                        onClick={() => handleDelete(goal.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold font-mono tabular-nums text-foreground">
                        {formatCurrency(current)}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono tabular-nums">
                        dari {formatCurrency(target)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Progress
                        value={percentage}
                        className="h-2.5 bg-muted"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground font-mono">
                        <span>Progres Tercapai</span>
                        <span className="font-semibold text-foreground">{percentage}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {isCompleted ? "Target telah terpenuhi 🎉" : `Kurang ${formatCurrency(Math.max(0, target - current))}`}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-xs h-8"
                      onClick={() => handleOpenDeposit(goal)}
                    >
                      <ArrowUpRight className="size-3.5" />
                      Kelola Saldo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {formOpen && (
        <GoalFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          existingGoal={selectedGoal}
          onSuccess={onRefresh}
        />
      )}

      {depositOpen && selectedGoal && (
        <GoalDepositDialog
          open={depositOpen}
          onOpenChange={setDepositOpen}
          goal={selectedGoal}
          onSuccess={onRefresh}
        />
      )}
    </div>
  )
}
