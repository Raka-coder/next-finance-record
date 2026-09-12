"use client"

import { useState, useEffect, useCallback } from "react"
import { AnalyticsService } from "@/services/analytics.service"
import { MomComparisonCards } from "@/components/dashboard/analytics/mom-comparison-cards"
import { CashflowTrendChart } from "@/components/dashboard/analytics/cashflow-trend-chart"
import { CategoryDistributionChart } from "@/components/dashboard/analytics/category-distribution-chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, RefreshCw, Sparkles, AlertCircle } from "lucide-react"
import type { MonthOverMonthData, MonthlyTrendPoint, CategoryDistribution } from "@/services/analytics.service"

export default function AnalyticsPage() {
  const currentMonthDefault = new Date().toISOString().substring(0, 7) // 'YYYY-MM'
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthDefault)

  const [momData, setMomData] = useState<MonthOverMonthData | null>(null)
  const [sixMonthTrend, setSixMonthTrend] = useState<MonthlyTrendPoint[]>([])
  const [categoryDist, setCategoryDist] = useState<CategoryDistribution[]>([])
  const [loading, setLoading] = useState(true)

  const getMonthOptions = () => {
    const options: { value: string; label: string }[] = []
    const now = new Date()
    const monthsLocale = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]

    for (let i = -5; i <= 1; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const lbl = `${monthsLocale[d.getMonth()]} ${d.getFullYear()}`
      options.push({ value: val, label: lbl })
    }
    return options
  }

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      const [mom, trend, cat] = await Promise.all([
        AnalyticsService.getMonthOverMonthComparison(),
        AnalyticsService.getSixMonthTrend(),
        AnalyticsService.getCategoryDistribution(selectedMonth),
      ])
      setMomData(mom)
      setSixMonthTrend(trend)
      setCategoryDist(cat)
    } catch (err) {
      console.error("Error loading analytics:", err)
    } finally {
      setLoading(false)
    }
  }, [selectedMonth])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  const topCategory = categoryDist.length > 0 ? categoryDist[0] : null

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analitik Finansial & Tren</h1>
          <p className="text-sm text-muted-foreground">
            Evaluasi performa arus kas, perbandingan bulan ke bulan, dan komposisi pengeluaran Anda.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Calendar className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Periode:</span>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {getMonthOptions().map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="size-9 shrink-0" onClick={loadAnalytics}>
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-muted-foreground">Memuat analitik data keuangan...</div>
      ) : (
        <>
          {/* 1. Month-over-Month Cards */}
          {momData && <MomComparisonCards data={momData} />}

          {/* 2. Insight Highlights Card */}
          {topCategory && (
            <Card className="border-border/60 bg-muted/20">
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="size-4" />
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Insight Periode Ini:</span> Pos belanja terbesar Anda berada pada kategori{" "}
                  <span className="font-semibold text-foreground">{topCategory.category}</span> dengan porsi{" "}
                  <span className="font-semibold font-mono text-foreground">{topCategory.percentage}%</span> dari seluruh pengeluaran.
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CashflowTrendChart data={sixMonthTrend} />
            <CategoryDistributionChart data={categoryDist} month={selectedMonth} />
          </div>
        </>
      )}
    </div>
  )
}
