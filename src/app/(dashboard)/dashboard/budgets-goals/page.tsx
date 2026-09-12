"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BudgetList } from "@/components/dashboard/budgets/budget-list"
import { GoalList } from "@/components/dashboard/budgets/goal-list"
import { BudgetService } from "@/services/budget.service"
import { GoalService } from "@/services/goal.service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Target, PiggyBank, Calendar } from "lucide-react"
import type { BudgetProgress, Goal } from "@/interfaces/budget-interface"

export default function BudgetsGoalsPage() {
  const currentMonthDefault = new Date().toISOString().substring(0, 7) // 'YYYY-MM'
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthDefault)

  const [budgetProgress, setBudgetProgress] = useState<BudgetProgress[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [loadingBudgets, setLoadingBudgets] = useState(true)
  const [loadingGoals, setLoadingGoals] = useState(true)

  // Generate list of recent and upcoming months for the picker
  const getMonthOptions = () => {
    const options: { value: string; label: string }[] = []
    const now = new Date()
    const monthsLocale = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

    for (let i = -3; i <= 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const lbl = `${monthsLocale[d.getMonth()]} ${d.getFullYear()}`
      options.push({ value: val, label: lbl })
    }
    return options
  }

  const loadBudgets = useCallback(async () => {
    try {
      setLoadingBudgets(true)
      const data = await BudgetService.getBudgetProgress(selectedMonth)
      setBudgetProgress(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingBudgets(false)
    }
  }, [selectedMonth])

  const loadGoals = useCallback(async () => {
    try {
      setLoadingGoals(true)
      const data = await GoalService.getGoals()
      setGoals(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingGoals(false)
    }
  }, [])

  useEffect(() => {
    loadBudgets()
  }, [loadBudgets])

  useEffect(() => {
    loadGoals()
  }, [loadGoals])

  return (
    <div className="space-y-6">
      {/* Top Header & Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Anggaran & Target Finansial</h1>
          <p className="text-sm text-muted-foreground">
            Kelola batasan pengeluaran bulanan dan pantau target impian masa depan Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Calendar className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Periode:</span>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {getMonthOptions().map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="budgets" className="space-y-6">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="budgets" className="gap-2">
            <Target className="size-4" />
            Batas Anggaran
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-2">
            <PiggyBank className="size-4" />
            Target Tabungan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-4">
          <BudgetList
            month={selectedMonth}
            progressList={budgetProgress}
            isLoading={loadingBudgets}
            onRefresh={loadBudgets}
          />
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <GoalList
            goals={goals}
            isLoading={loadingGoals}
            onRefresh={loadGoals}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
