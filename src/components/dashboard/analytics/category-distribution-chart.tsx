"use client"

import { useEffect, useRef } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { CategoryDistribution } from "@/services/analytics.service"

interface CategoryDistributionChartProps {
  data: CategoryDistribution[]
  month: string
}

export function CategoryDistributionChart({ data, month }: CategoryDistributionChartProps) {
  const { theme } = useTheme()
  const chartRef = useRef<HighchartsReact.RefObject>(null)

  const isDark = theme === "dark"

  const palette = [
    "#F43F5E", // Rose
    "#FB923C", // Orange
    "#FBBF24", // Amber
    "#34D399", // Emerald
    "#38BDF8", // Sky
    "#818CF8", // Indigo
    "#C084FC", // Purple
    "#94A3B8", // Slate
  ]

  const chartData = data.map((item, idx) => ({
    name: item.category,
    y: item.amount,
    color: palette[idx % palette.length],
  }))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
      style: {
        fontFamily: "Inter, system-ui, sans-serif",
      },
      height: 340,
    },
    title: {
      text: undefined,
    },
    tooltip: {
      backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
      borderColor: isDark ? "#334155" : "#E2E8F0",
      style: {
        color: isDark ? "#F8FAFC" : "#0F172A",
        fontSize: "12px",
      },
      formatter: function () {
        const point = this as unknown as { name?: string; y?: number; percentage?: number }
        const name = point.name || ""
        const val = typeof point.y === "number" ? point.y.toLocaleString("id-ID") : "0"
        const pct = typeof point.percentage === "number" ? point.percentage.toFixed(1) : "0"
        return `<b>${name}</b><br/>Nominal: <b>Rp ${val}</b><br/>Porsi: <b>${pct}%</b>`
      },
    },
    plotOptions: {
      pie: {
        innerSize: "55%", // Donut style
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 4,
        borderWidth: 2,
        borderColor: isDark ? "#0F172A" : "#FFFFFF",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.0f}%",
          style: {
            color: isDark ? "#CBD5E1" : "#475569",
            fontSize: "11px",
          },
          distance: 15,
        },
      },
    },
    series: [
      {
        type: "pie",
        name: "Pengeluaran",
        data: chartData,
      },
    ],
    credits: {
      enabled: false,
    },
  }

  useEffect(() => {
    if (chartRef.current?.chart) {
      chartRef.current.chart.reflow()
    }
  }, [theme, data])

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Distribusi Kategori Pengeluaran</CardTitle>
        <CardDescription className="text-xs">
          Proporsi pos belanja pada periode {month}.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
            Tidak ada transaksi pengeluaran pada bulan ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
            <div className="lg:col-span-3">
              <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
            </div>

            <div className="lg:col-span-2 space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {data.map((item, idx) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between p-2 rounded-md bg-muted/30 border text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: palette[idx % palette.length] }}
                    />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="text-right font-mono tabular-nums">
                    <span className="font-semibold">{formatCurrency(item.amount)}</span>{" "}
                    <span className="text-muted-foreground">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
