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

export function PieChart({ title, data, height = 300, showLegend = true }: PieChartProps) {
  const { theme } = useTheme()
  const chartRef = useRef<HighchartsReact.RefObject>(null)

  // Define colors for categories
  const getCategoryColor = (categoryName: string, type: "income" | "expense") => {
    const incomeColors = {
      Gaji: "#10B981",
      Freelance: "#059669",
      Investasi: "#047857",
      Bonus: "#065F46",
      Lainnya: "#064E3B",
    }

    const expenseColors = {
      Makanan: "#EF4444",
      Transportasi: "#DC2626",
      Belanja: "#B91C1C",
      Tagihan: "#991B1B",
      Hiburan: "#7F1D1D",
      Kesehatan: "#6B1D1D",
      Lainnya: "#5B1D1D",
    }

    if (type === "income") {
      return incomeColors[categoryName as keyof typeof incomeColors] || "#10B981"
    } else {
      return expenseColors[categoryName as keyof typeof expenseColors] || "#EF4444"
    }
  }

  // Determine chart type based on title
  const chartType = title.toLowerCase().includes("pengeluaran") ? "expense" : "income"

  // Add colors to data
  const dataWithColors = data.map((item) => ({
    ...item,
    color: getCategoryColor(item.name, chartType),
  }))

  // Calculate total for percentage calculation
  const totalAmount = data.reduce((sum, item) => sum + item.y, 0)

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      height: height,
      backgroundColor: "transparent",
      style: {
        fontFamily: "Inter, system-ui, sans-serif",
      },
    },
    title: {
      text: title,
      style: {
        color: theme === "dark" ? "#F9FAFB" : "#111827",
        fontSize: "16px",
        fontWeight: "600",
      },
    },
    tooltip: {
      backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
      borderColor: theme === "dark" ? "#4B5563" : "#E5E7EB",
      style: {
        color: theme === "dark" ? "#F9FAFB" : "#111827",
      },
      formatter: function () {
        const point = this.series.points[this.series.data.indexOf(this)];
        if (!point || typeof point.y !== "number" || !point.name) {
        return "<b>Data tidak tersedia</b>";
        }

        const percentage = totalAmount > 0 ? ((point.y / totalAmount) * 100).toFixed(1) : "0.0";
        const formattedAmount = point.y.toLocaleString("id-ID");

        return `<b>${point.name}</b><br/>
                Jumlah: <b>Rp ${formattedAmount}</b><br/>
                Persentase: <b>${percentage}%</b>`;
        },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
          style: {
            color: theme === "dark" ? "#D1D5DB" : "#374151",
            fontSize: "12px",
          },
          distance: 20,
        },
        showInLegend: showLegend,
        borderWidth: 2,
        borderColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
      },
    },
    legend: {
      enabled: showLegend,
      align: "center",
      verticalAlign: "bottom",
      layout: "horizontal",
      itemStyle: {
        color: theme === "dark" ? "#D1D5DB" : "#374151",
        fontSize: "12px",
      },
      itemHoverStyle: {
        color: theme === "dark" ? "#F9FAFB" : "#111827",
      },
    },
    series: [
      {
        type: "pie",
        name: "Jumlah",
        data: dataWithColors,
        size: "80%",
        innerSize: "40%", // Donut style
      },
    ],
    credits: {
      enabled: false,
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            plotOptions: {
              pie: {
                dataLabels: {
                  enabled: false,
                },
              },
            },
            legend: {
              enabled: true,
            },
          },
        },
      ],
    },
  }

  // Update chart theme when theme changes
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.chart
      if (chart) {
        chart.update({
          title: {
            style: {
              color: theme === "dark" ? "#F9FAFB" : "#111827",
            },
          },
          tooltip: {
            backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
            borderColor: theme === "dark" ? "#4B5563" : "#E5E7EB",
            style: {
              color: theme === "dark" ? "#F9FAFB" : "#111827",
            },
          },
          plotOptions: {
            pie: {
              dataLabels: {
                style: {
                  color: theme === "dark" ? "#D1D5DB" : "#374151",
                },
              },
              borderColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
            },
          },
          legend: {
            itemStyle: {
              color: theme === "dark" ? "#D1D5DB" : "#374151",
            },
            itemHoverStyle: {
              color: theme === "dark" ? "#F9FAFB" : "#111827",
            },
          },
        })
      }
    }
  }, [theme])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">Tidak ada data untuk ditampilkan</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <HighchartsReact ref={chartRef} highcharts={Highcharts} options={options} />
    </div>
  )
}
