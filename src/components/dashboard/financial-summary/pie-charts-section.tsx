import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "@/components/charts/pie-chart"

interface PieChartsSectionProps {
  incomePieData: { name: string; y: number }[]
  expensePieData: { name: string; y: number }[]
}

export function PieChartsSection({ incomePieData, expensePieData }: PieChartsSectionProps) {
  return (
    <Card className="border border-border bg-card p-5 gap-0">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight">
            Distribusi Kategori
          </CardTitle>
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            Visualisasi
          </span>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Perbandingan proporsi arus kas masuk dan keluar per pos kategori
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Income Pie Chart */}
          <div className="pt-2 lg:pt-0 lg:pr-4">
            <div className="text-xs font-mono font-medium text-foreground mb-2">Kas Masuk</div>
            <PieChart title="" data={incomePieData} height={280} showLegend={true} colorScheme="income" />
          </div>

          {/* Expense Pie Chart */}
          <div className="pt-6 lg:pt-0 lg:pl-4">
            <div className="text-xs font-mono font-medium text-foreground mb-2">Kas Keluar</div>
            <PieChart title="" data={expensePieData} height={280} showLegend={true} colorScheme="expense" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}