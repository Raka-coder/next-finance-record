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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="size-5 text-red-600" />
            Top Kategori Pengeluaran
          </CardTitle>
          <CardDescription>Kategori dengan pengeluaran terbesar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topExpenseCategories.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Belum ada data pengeluaran</p>
            ) : (
              topExpenseCategories.map(([category, amount]) => {
                const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-red-600 font-medium">{formatCurrency(amount)}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% dari total pengeluaran</p>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5 text-green-600" />
            Top Kategori Pemasukan
          </CardTitle>
          <CardDescription>Kategori dengan pemasukan terbesar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topIncomeCategories.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Belum ada data pemasukan</p>
            ) : (
              topIncomeCategories.map(([category, amount]) => {
                const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-sm text-green-600 font-medium">{formatCurrency(amount)}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% dari total pemasukan</p>
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