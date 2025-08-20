import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { Transaction } from "@/interfaces/transaction-interface"

interface RecentTransactionsCardProps {
  transactions: Transaction[]
  formatCurrency: (amount: number) => string
}

export function RecentTransactionsCard({ transactions, formatCurrency }: RecentTransactionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Terbaru</CardTitle>
        <CardDescription>5 transaksi terakhir yang ditambahkan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                  {transaction.type === "income" ? (
                    <TrendingUp className="size-4 text-green-600" />
                  ) : (
                    <TrendingDown className="size-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category} • {new Date(transaction.date).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
              <div className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Belum ada transaksi. Mulai tambahkan transaksi pertama Anda!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}