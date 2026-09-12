import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Wallet, PieChart, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react"
import type { Transaction } from "@/interfaces/transaction-interface"

type SummaryCardsProps = {
  transactions: Transaction[]
  formatCurrency: (amount: number) => string
  onOpenAddTransaction?: () => void
}

export function SummaryCards({ transactions, formatCurrency, onOpenAddTransaction }: SummaryCardsProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense
  const expensePercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0
  const incomeCount = transactions.filter((t) => t.type === "income").length
  const expenseCount = transactions.filter((t) => t.type === "expense").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Saldo Bersih Hero Card - Spans 2 cols on tablet & desktop */}
      <Card className="md:col-span-2 relative overflow-hidden bg-card/70 backdrop-blur-sm border-border/80 shadow-sm">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Saldo Bersih
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Status akumulasi pemasukan dan pengeluaran
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onOpenAddTransaction && (
              <Button
                size="sm"
                onClick={onOpenAddTransaction}
                className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 text-xs font-semibold shadow-xs"
              >
                <Plus className="size-3.5" />
                <span>Catat Transaksi</span>
              </Button>
            )}
            <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Wallet className="size-5" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight tabular-nums">
              {formatCurrency(balance)}
            </div>
            <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-full text-xs font-medium border">
              {balance >= 0 ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="size-3.5" /> Surplus
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20 px-2 py-0.5 rounded-full">
                  <ArrowDownRight className="size-3.5" /> Defisit
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Catatan: {transactions.length} transaksi</span>
            <span className="font-mono">{expensePercentage.toFixed(1)}% terpakai</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Pemasukan Card */}
      <Card className="bg-card/70 backdrop-blur-sm border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pemasukan
          </CardTitle>
          <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatCurrency(totalIncome)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
            <span>{incomeCount} transaksi masuk</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Pengeluaran Card */}
      <Card className="bg-card/70 backdrop-blur-sm border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pengeluaran
          </CardTitle>
          <div className="size-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <TrendingDown className="size-4" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
            {formatCurrency(totalExpense)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block size-1.5 rounded-full bg-rose-500" />
            <span>{expenseCount} transaksi keluar</span>
          </div>
        </CardContent>
      </Card>

      {/* Rasio Pengeluaran Sub-Card */}
      <div className="lg:col-span-4">
        <div className="bg-muted/40 border border-border/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <PieChart className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rasio Pengeluaran terhadap Pemasukan
              </p>
              <p className="text-xs text-muted-foreground">
                Persentase anggaran yang dibelanjakan dari seluruh dana masuk
              </p>
            </div>
          </div>
          <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-muted-foreground">Rasio saat ini:</span>
              <span className="font-semibold text-foreground">{expensePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={Math.min(expensePercentage, 100)} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  )
}