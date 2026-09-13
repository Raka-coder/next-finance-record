"use client"

import { useEffect, useRef } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { MonthlyTrendPoint } from "@/services/analytics.service"

interface CashflowTrendChartProps {
  data: MonthlyTrendPoint[]
}

export function CashflowTrendChart({ data }: CashflowTrendChartProps) {
  const { theme } = useTheme()
  const chartRef = useRef<HighchartsReact.RefObject>(null)

  const isDark = theme === "dark"
  const categories = data.map((d) => d.month)
  const incomeSeries = data.map((d) => d.income)
  const expenseSeries = data.map((d) => d.expense)

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
      style: {
        fontFamily: "Inter, system-ui, sans-serif",
      },
      height: 340,
    },
    title: {
      text: undefined,
    },
    xAxis: {
      categories,
      crosshair: true,
      labels: {
        style: {
          color: isDark ? "#94A3B8" : "#64748B",
          fontSize: "12px",
        },
      },
      lineColor: isDark ? "#334155" : "#E2E8F0",
    },
    yAxis: {
      min: 0,
      title: {
        text: undefined,
      },
      labels: {
        formatter: function () {
          return "Rp " + (Number(this.value) / 1000000).toFixed(1) + "M"
        },
        style: {
          color: isDark ? "#94A3B8" : "#64748B",
          fontSize: "11px",
        },
      },
      gridLineColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
    },
    tooltip: {
      shared: true,
      backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
      borderColor: isDark ? "#334155" : "#E2E8F0",
      style: {
        color: isDark ? "#F8FAFC" : "#0F172A",
        fontSize: "12px",
      },
      formatter: function () {
        let s = `<b>${this.x}</b><br/>`
        this.points?.forEach((point) => {
          const val = point.y ? point.y.toLocaleString("id-ID") : "0"
          s += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>Rp ${val}</b><br/>`
        })
        return s
      },
    },
    plotOptions: {
      column: {
        borderRadius: 2,
        pointPadding: 0.15,
        groupPadding: 0.2,
        borderWidth: 0,
      },
    },
    legend: {
      itemStyle: {
        color: isDark ? "#A1A1A0" : "#555555",
        fontWeight: "500",
        fontSize: "11px",
      },
    },
    series: [
      {
        name: "Pemasukan",
        type: "column",
        data: incomeSeries,
        color: "#346538",
      },
      {
        name: "Pengeluaran",
        type: "column",
        data: expenseSeries,
        color: "#9F2F2D",
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
    <Card className="border border-border bg-card p-5 gap-0 shadow-none rounded-md">
      <CardHeader className="p-0 pb-4 space-y-1">
        <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-muted-foreground">
          Arus Kas Multi-Bulan
        </span>
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
          Tren Arus Kas 6 Bulan Terakhir
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Perbandingan historis pemasukan vs pengeluaran tiap bulan
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-3">
        {data.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center font-mono text-xs text-muted-foreground">
            Belum cukup data transaksi untuk menampilkan tren multi-bulan.
          </div>
        ) : (
          <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
        )}
      </CardContent>
    </Card>
  )
}
