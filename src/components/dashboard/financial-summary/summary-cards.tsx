import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Transaction } from "@/interfaces/transaction-interface"

type SummaryCardsProps = {
  transactions: Transaction[]
  formatCurrency: (amount: number) => string
}

export function SummaryCards({ transactions, formatCurrency }: SummaryCardsProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Saldo Bersih Hero Card - Asymmetric Bento (Spans 2 cols) */}
      <Card className="md:col-span-2 border border-border bg-card p-5 gap-0 justify-between">
        <div>
          <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between space-y-0">
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-muted-foreground">
              Saldo Bersih
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-wide uppercase border ${
                balance >= 0
                  ? "bg-[#EDF3EC] text-[#346538] border-[#D0E6CD] dark:bg-[#1A2E1C] dark:text-[#81C784] dark:border-[#224424]"
                  : "bg-[#FDEBEC] text-[#9F2F2D] border-[#F5C2C7] dark:bg-[#321B1B] dark:text-[#F87171] dark:border-[#5C2323]"
              }`}
            >
              {balance >= 0 ? "Surplus" : "Defisit"}
            </span>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-mono font-medium tracking-tight text-foreground tabular-nums">
              {formatCurrency(balance)}
            </div>
          </CardContent>
        </div>

        <div className="mt-6 pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <span>{transactions.length} total catatan</span>
          <span>{expensePercentage.toFixed(1)}% rasio pengeluaran</span>
        </div>
      </Card>

      {/* Pemasukan Card */}
      <Card className="border border-border bg-card p-5 gap-0 justify-between">
        <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between space-y-0">
          <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-muted-foreground">
            Pemasukan
          </span>
          <span className="size-2 rounded-full bg-[#346538] dark:bg-[#81C784]" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-2xl font-mono font-medium text-foreground tabular-nums">
            {formatCurrency(totalIncome)}
          </div>
          <p className="mt-3 text-[11px] font-mono text-muted-foreground">
            {incomeCount} transaksi masuk
          </p>
        </CardContent>
      </Card>

      {/* Pengeluaran Card */}
      <Card className="border border-border bg-card p-5 gap-0 justify-between">
        <CardHeader className="p-0 pb-2 flex flex-row items-center justify-between space-y-0">
          <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-muted-foreground">
            Pengeluaran
          </span>
          <span className="size-2 rounded-full bg-[#9F2F2D] dark:bg-[#F87171]" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-2xl font-mono font-medium text-foreground tabular-nums">
            {formatCurrency(totalExpense)}
          </div>
          <p className="mt-3 text-[11px] font-mono text-muted-foreground">
            {expenseCount} transaksi keluar
          </p>
        </CardContent>
      </Card>

      {/* Rasio Baris Terpadu */}
      <div className="lg:col-span-4 border border-border bg-card rounded-md px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-muted-foreground">
            Rasio Pengeluaran
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Persentase anggaran dibelanjakan terhadap total penerimaan
          </span>
        </div>
        <div className="w-full sm:w-60 flex items-center gap-3">
          <Progress value={Math.min(expensePercentage, 100)} className="h-1.5 flex-1 bg-muted" />
          <span className="text-xs font-mono font-medium text-foreground tabular-nums shrink-0">
            {expensePercentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}