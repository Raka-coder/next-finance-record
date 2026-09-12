"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PieChart } from "@/components/charts/pie-chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart as PieChartIcon, TrendingDown, TrendingUp } from "lucide-react"

interface CategoryAnalysisSectionProps {
  topExpenseCategories: [string, number][]
  topIncomeCategories: [string, number][]
  expensePieData: { name: string; y: number }[]
  incomePieData: { name: string; y: number }[]
  totalExpense: number
  totalIncome: number
  formatCurrency: (amount: number) => string
}

export function CategoryAnalysisSection({
  topExpenseCategories,
  topIncomeCategories,
  expensePieData,
  incomePieData,
  totalExpense,
  totalIncome,
  formatCurrency,
}: CategoryAnalysisSectionProps) {
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense")

  const isExpense = activeTab === "expense"
  const currentCategories = isExpense ? topExpenseCategories : topIncomeCategories
  const currentTotal = isExpense ? totalExpense : totalIncome
  const currentPieData = isExpense ? expensePieData : incomePieData

  return (
    <Card className="bg-card/75 backdrop-blur-sm border-border/70 rounded-2xl shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <PieChartIcon className="size-4" />
            </div>
            Distribusi & Analisis Kategori
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Komposisi persentase dan daftar pos finansial terbesar Anda
          </CardDescription>
        </div>

        {/* Tab switcher: Pengeluaran vs Pemasukan */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "expense" | "income")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-2 w-full sm:w-56 h-9 rounded-xl p-1 bg-muted/60">
            <TabsTrigger
              value="expense"
              className="rounded-lg text-xs font-medium gap-1.5 data-[state=active]:bg-background data-[state=active]:text-rose-500 data-[state=active]:shadow-xs"
            >
              <TrendingDown className="size-3.5" />
              Pengeluaran
            </TabsTrigger>
            <TabsTrigger
              value="income"
              className="rounded-lg text-xs font-medium gap-1.5 data-[state=active]:bg-background data-[state=active]:text-emerald-500 data-[state=active]:shadow-xs"
            >
              <TrendingUp className="size-3.5" />
              Pemasukan
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="pt-2">
        {currentCategories.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            Belum ada catatan {isExpense ? "pengeluaran" : "pemasukan"} untuk dianalisis.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Donut Chart */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md">
                <PieChart
                  title=""
                  data={currentPieData}
                  height={280}
                  showLegend={false}
                />
              </div>
            </div>

            {/* List with Progress Bars */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex justify-between items-center text-xs text-muted-foreground font-medium pb-1 border-b border-border/50">
                <span>Kategori Utama</span>
                <span>Nominal & Porsi</span>
              </div>

              {currentCategories.map(([category, amount]) => {
                const percentage = currentTotal > 0 ? (amount / currentTotal) * 100 : 0
                return (
                  <div
                    key={category}
                    className="p-2.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-foreground">{category}</span>
                      <div className="text-right font-mono tabular-nums">
                        <span className={`font-bold ${isExpense ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                          {formatCurrency(amount)}
                        </span>
                        <span className="text-muted-foreground ml-1.5">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-1.5 ${isExpense ? "[&>div]:bg-rose-500" : "[&>div]:bg-emerald-500"}`}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
