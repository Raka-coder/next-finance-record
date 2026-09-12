import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, ArrowUpRight, Plus } from "lucide-react"
import Link from "next/link"
import type { Transaction } from "@/interfaces/transaction-interface"

interface RecentTransactionsCardProps {
  transactions: Transaction[]
  formatCurrency: (amount: number) => string
  onOpenAddTransaction?: () => void
}

export function RecentTransactionsCard({
  transactions,
  formatCurrency,
  onOpenAddTransaction,
}: RecentTransactionsCardProps) {
  const recent = transactions.slice(0, 5)

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-border/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-base font-bold tracking-tight">Transaksi Terbaru</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {recent.length > 0 ? "5 aktivitas keuangan terakhir yang tercatat" : "Belum ada transaksi"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {onOpenAddTransaction && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAddTransaction}
              className="text-xs h-8 gap-1.5 font-medium cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Tambah</span>
            </Button>
          )}
          {transactions.length > 0 && (
            <Button asChild variant="ghost" size="sm" className="text-xs h-8 gap-1 font-medium text-muted-foreground hover:text-foreground">
              <Link href="/dashboard/transaction-lists">
                Lihat Semua <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recent.map((transaction) => {
            const isIncome = transaction.type === "income"
            return (
              <div
                key={transaction.id}
                className="group flex items-center justify-between p-3 rounded-xl border border-border/60 bg-background/50 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      isIncome
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {isIncome ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate text-foreground">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="font-medium">{transaction.category}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`font-mono text-sm font-bold tabular-nums shrink-0 ml-4 ${
                    isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            )
          })}
          {transactions.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-muted-foreground mb-4">
                Belum ada transaksi tercatat pada akun ini.
              </p>
              {onOpenAddTransaction && (
                <Button size="sm" variant="outline" onClick={onOpenAddTransaction} className="inline-flex items-center gap-2">
                  <Plus className="size-3.5" />
                  Tambah Transaksi
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}