"use client"

import { useEffect, useRef } from "react"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import { useTheme } from "next-themes"

interface PieChartData {
  name: string
  y: number
  color?: string
}

interface PieChartProps {
  title: string
  data: PieChartData[]
  height?: number
  showLegend?: boolean
}

export function PieChart({ title, data, height = 280, showLegend = true }: PieChartProps) {
  const { theme } = useTheme()
  const chartRef = useRef<HighchartsReact.RefObject>(null)

  // Muted pastels palette inspired by Linear/Notion
  const palette = [
    "#346538", // Forest Muted Green
    "#1F6C9F", // Slate Blue
    "#956400", // Muted Amber
    "#6B5B95", // Muted Violet
    "#9F2F2D", // Muted Brick
    "#5A6B7C", // Muted Steel
    "#787774", // Neutral Gray
  ]

  const dataWithColors = data.map((item, idx) => ({
    ...item,
    color: item.color || palette[idx % palette.length],
  }))

  const totalAmount = data.reduce((sum, item) => sum + item.y, 0)

  const isDark = theme === "dark"

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      height: height,
      backgroundColor: "transparent",
      style: {
        fontFamily: "var(--font-mono), monospace",
      },
    },
    title: {
      text: title || undefined,
      style: {
        color: isDark ? "#EDEDED" : "#1A1A1A",
        fontSize: "13px",
        fontWeight: "500",
      },
    },
    tooltip: {
      backgroundColor: isDark ? "#1C1C1C" : "#FFFFFF",
      borderColor: isDark ? "#2A2A2A" : "#E8E7E3",
      borderRadius: 4,
      shadow: false,
      style: {
        color: isDark ? "#EDEDED" : "#1A1A1A",
        fontSize: "11px",
      },
      formatter: function () {
        const point = this.series.points[this.series.data.indexOf(this)];
        if (!point || typeof point.y !== "number" || !point.name) {
          return "Data tidak tersedia";
        }
        const percentage = totalAmount > 0 ? ((point.y / totalAmount) * 100).toFixed(1) : "0.0";
        const formattedAmount = point.y.toLocaleString("id-ID");
        return `<b>${point.name}</b><br/>Rp ${formattedAmount} (${percentage}%)`;
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: showLegend,
        borderWidth: 1,
        borderColor: isDark ? "#1C1C1C" : "#FFFFFF",
      },
    },
    legend: {
      enabled: showLegend,
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: {
        color: isDark ? "#8C8B88" : "#787774",
        fontSize: "11px",
        fontWeight: "400",
      },
      itemHoverStyle: {
        color: isDark ? "#EDEDED" : "#1A1A1A",
      },
    },
    series: [
      {
        type: "pie",
        name: "Jumlah",
        data: dataWithColors,
        size: "90%",
        innerSize: "55%", // Donut style
      },
    ],
    credits: {
      enabled: false,
    },
  }

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.chart
      if (chart) {
        chart.update({
          tooltip: {
            backgroundColor: isDark ? "#1C1C1C" : "#FFFFFF",
            borderColor: isDark ? "#2A2A2A" : "#E8E7E3",
            style: {
              color: isDark ? "#EDEDED" : "#1A1A1A",
            },
          },
          legend: {
            itemStyle: {
              color: isDark ? "#8C8B88" : "#787774",
            },
            itemHoverStyle: {
              color: isDark ? "#EDEDED" : "#1A1A1A",
            },
          },
        })
      }
    }
  }, [isDark])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px] border border-dashed border-border rounded-[4px]">
        <p className="text-xs font-mono text-muted-foreground">Tidak ada data</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
    </div>
  )
}
