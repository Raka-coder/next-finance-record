import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CategoryBreakdownProps {
  topExpenseCategories: [string, number][]
  topIncomeCategories: [string, number][]
  totalExpense: number
  totalIncome: number
  formatCurrency: (amount: number) => string
}

export function CategoryBreakdown({ 
  topExpenseCategories, 
  topIncomeCategories, 
  totalExpense, 
  totalIncome,
  formatCurrency
}: CategoryBreakdownProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Pengeluaran */}
      <Card className="bg-card/70 backdrop-blur-sm border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <div className="size-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <TrendingDown className="size-4" />
            </div>
            Top Kategori Pengeluaran
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Kategori dengan proporsi pengeluaran terbesar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topExpenseCategories.length === 0 ? (
              <div className="text-muted-foreground text-xs text-center py-8">Belum ada data pengeluaran</div>
            ) : (
              topExpenseCategories.map(([category, amount]) => {
                const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0
                return (
                  <div key={category} className="space-y-1.5 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-foreground">{category}</span>
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                    <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                      <span>Porsi anggaran</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Pemasukan */}
      <Card className="bg-card/70 backdrop-blur-sm border-border/80 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <div className="size-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="size-4" />
            </div>
            Top Kategori Pemasukan
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Sumber arus kas pemasukan terbesar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topIncomeCategories.length === 0 ? (
              <div className="text-muted-foreground text-xs text-center py-8">Belum ada data pemasukan</div>
            ) : (
              topIncomeCategories.map(([category, amount]) => {
                const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0
                return (
                  <div key={category} className="space-y-1.5 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-foreground">{category}</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                    <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                      <span>Porsi penerimaan</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}