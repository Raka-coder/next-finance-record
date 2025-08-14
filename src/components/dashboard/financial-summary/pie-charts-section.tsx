import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "@/components/charts/pie-chart"
import { PieChartIcon } from "lucide-react"

interface PieChartsSectionProps {
  incomePieData: { name: string; y: number }[]
  expensePieData: { name: string; y: number }[]
}

export function PieChartsSection({ incomePieData, expensePieData }: PieChartsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="size-5 text-blue-600" />
          Distribusi Keuangan Berdasarkan Kategori
        </CardTitle>
        <CardDescription>Visualisasi pembagian pemasukan dan pengeluaran per kategori</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Pie Chart */}
          <div className="space-y-2">
            <PieChart title="Distribusi Pemasukan" data={incomePieData} height={350} showLegend={true} />
          </div>

          {/* Expense Pie Chart */}
          <div className="space-y-2">
            <PieChart title="Distribusi Pengeluaran" data={expensePieData} height={350} showLegend={true} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}