import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Transaction } from "@/interfaces/transaction-interface"

interface RecentTransactionsCardProps {
  transactions: Transaction[]
  formatCurrency: (amount: number) => string
}

export function RecentTransactionsCard({
  transactions,
  formatCurrency,
}: RecentTransactionsCardProps) {
  const recent = transactions.slice(0, 5)

  return (
    <Card className="border border-border bg-card p-5 gap-0">
      <CardHeader className="p-0 pb-4 flex flex-row items-baseline justify-between">
        <div>
          <CardTitle className="text-sm font-semibold tracking-tight">Transaksi Terbaru</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            {recent.length > 0 ? "5 catatan arus kas terkini" : "Belum ada transaksi"}
          </CardDescription>
        </div>
        {transactions.length > 0 && (
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs font-mono text-muted-foreground hover:text-foreground">
            <Link href="/dashboard/transaction-lists">
              Semua &rarr;
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border border-t border-border">
          {recent.map((transaction) => {
            const isIncome = transaction.type === "income"
            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2.5 px-1 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-baseline gap-3 min-w-0">
                  <span
                    className={`size-1.5 rounded-full shrink-0 ${
                      isIncome ? "bg-[#346538] dark:bg-[#81C784]" : "bg-[#9F2F2D] dark:bg-[#F87171]"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground mt-0.5">
                      <span>{transaction.category}</span>
                      <span>&middot;</span>
                      <span>{new Date(transaction.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`font-mono text-xs font-medium tabular-nums shrink-0 ml-4 ${
                    isIncome ? "text-[#346538] dark:text-[#81C784]" : "text-[#9F2F2D] dark:text-[#F87171]"
                  }`}
                >
                  {isIncome ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            )
          })}
          {transactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-xs font-mono text-muted-foreground">
                Belum ada transaksi tercatat pada buku kas ini.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}