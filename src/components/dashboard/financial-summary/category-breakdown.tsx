import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Top Pengeluaran */}
      <Card className="border border-border bg-card p-5 gap-0">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold tracking-tight">Kategori Pengeluaran</CardTitle>
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Terbesar</span>
          </div>
          <CardDescription className="text-xs text-muted-foreground">Distribusi pengeluaran per kategori</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <div className="space-y-3">
            {topExpenseCategories.length === 0 ? (
              <div className="text-muted-foreground text-xs font-mono text-center py-6">Tidak ada catatan pengeluaran</div>
            ) : (
              topExpenseCategories.map(([category, amount]) => {
                const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-foreground">{category}</span>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-1 bg-muted" />
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                      <span>Porsi</span>
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
      <Card className="border border-border bg-card p-5 gap-0">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold tracking-tight">Kategori Pemasukan</CardTitle>
            <span className="text-[11px] font-mono text-muted-foreground uppercase">Terbesar</span>
          </div>
          <CardDescription className="text-xs text-muted-foreground">Distribusi penerimaan per kategori</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-2">
          <div className="space-y-3">
            {topIncomeCategories.length === 0 ? (
              <div className="text-muted-foreground text-xs font-mono text-center py-6">Tidak ada catatan pemasukan</div>
            ) : (
              topIncomeCategories.map(([category, amount]) => {
                const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-foreground">{category}</span>
                      <span className="font-mono font-medium text-foreground tabular-nums">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-1 bg-muted" />
                    <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                      <span>Porsi</span>
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