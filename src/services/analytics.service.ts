import { createClient } from "@/utils/supabase/client"

export interface MonthOverMonthData {
  currentMonth: string // 'YYYY-MM'
  previousMonth: string
  current: {
    income: number
    expense: number
    net: number
    savingsRate: number
  }
  previous: {
    income: number
    expense: number
    net: number
    savingsRate: number
  }
  deltas: {
    incomePercent: number // e.g. +15.5 atau -8.2
    expensePercent: number
    netDelta: number
  }
}

export interface MonthlyTrendPoint {
  month: string // e.g. 'Jan 2026'
  rawMonth: string // '2026-01'
  income: number
  expense: number
  net: number
}

export interface CategoryDistribution {
  category: string
  amount: number
  percentage: number
}

export class AnalyticsService {
  private static getClient() {
    return createClient()
  }

  /**
   * Menghitung komparasi Month-over-Month antara bulan ini dan bulan lalu
   */
  static async getMonthOverMonthComparison(): Promise<MonthOverMonthData> {
    const supabase = this.getClient()
    const now = new Date()

    // Tanggal bulan ini
    const curYear = now.getFullYear()
    const curMonth = now.getMonth() // 0-indexed
    const curMonthKey = `${curYear}-${String(curMonth + 1).padStart(2, "0")}`

    // Tanggal bulan lalu
    const prevDate = new Date(curYear, curMonth - 1, 1)
    const prevYear = prevDate.getFullYear()
    const prevMonth = prevDate.getMonth()
    const prevMonthKey = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}`

    const startPrev = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-01`
    const lastDayOfMonth = new Date(curYear, curMonth + 1, 0).getDate()
    const endCur = `${curYear}-${String(curMonth + 1).padStart(2, "0")}-${String(lastDayOfMonth).padStart(2, "0")}`

    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("date, amount, type")
      .gte("date", startPrev)
      .lte("date", endCur)

    if (error) {
      console.error("Error fetching transactions for analytics:", error)
      throw new Error("Gagal mengambil data analitik")
    }

    let curIncome = 0
    let curExpense = 0
    let prevIncome = 0
    let prevExpense = 0

    transactions?.forEach((tx) => {
      const txMonth = tx.date.substring(0, 7) // 'YYYY-MM'
      const amt = Number(tx.amount)

      if (txMonth === curMonthKey) {
        if (tx.type === "income") curIncome += amt
        else if (tx.type === "expense") curExpense += amt
      } else if (txMonth === prevMonthKey) {
        if (tx.type === "income") prevIncome += amt
        else if (tx.type === "expense") prevExpense += amt
      }
    })

    const curNet = curIncome - curExpense
    const prevNet = prevIncome - prevExpense
    const curSavingsRate = curIncome > 0 ? Math.round(((curIncome - curExpense) / curIncome) * 100) : 0
    const prevSavingsRate = prevIncome > 0 ? Math.round(((prevIncome - prevExpense) / prevIncome) * 100) : 0

    const calcPercentDelta = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0
      return Math.round(((curr - prev) / prev) * 100)
    }

    return {
      currentMonth: curMonthKey,
      previousMonth: prevMonthKey,
      current: {
        income: curIncome,
        expense: curExpense,
        net: curNet,
        savingsRate: curSavingsRate,
      },
      previous: {
        income: prevIncome,
        expense: prevExpense,
        net: prevNet,
        savingsRate: prevSavingsRate,
      },
      deltas: {
        incomePercent: calcPercentDelta(curIncome, prevIncome),
        expensePercent: calcPercentDelta(curExpense, prevExpense),
        netDelta: curNet - prevNet,
      },
    }
  }

  /**
   * Mengambil tren pemasukan dan pengeluaran 6 bulan terakhir
   */
  static async getSixMonthTrend(): Promise<MonthlyTrendPoint[]> {
    const supabase = this.getClient()
    const now = new Date()

    // 6 bulan ke belakang
    const startObj = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const startDate = `${startObj.getFullYear()}-${String(startObj.getMonth() + 1).padStart(2, "0")}-01`

    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("date, amount, type")
      .gte("date", startDate)
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching 6-month trends:", error)
      return []
    }

    // Siapkan wadah 6 bulan berurutan
    const monthMap: Record<string, { income: number; expense: number; label: string }> = {}
    const monthsLocale = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const label = `${monthsLocale[d.getMonth()]} ${d.getFullYear()}`
      monthMap[key] = { income: 0, expense: 0, label }
    }

    transactions?.forEach((tx) => {
      const key = tx.date.substring(0, 7)
      if (monthMap[key]) {
        const amt = Number(tx.amount)
        if (tx.type === "income") monthMap[key].income += amt
        else if (tx.type === "expense") monthMap[key].expense += amt
      }
    })

    return Object.entries(monthMap).map(([rawMonth, val]) => ({
      rawMonth,
      month: val.label,
      income: val.income,
      expense: val.expense,
      net: val.income - val.expense,
    }))
  }

  /**
   * Mengambil distribusi pengeluaran per kategori untuk bulan tertentu
   */
  static async getCategoryDistribution(month: string): Promise<CategoryDistribution[]> {
    const supabase = this.getClient()
    const [yearStr, monthStr] = month.split("-")
    const year = parseInt(yearStr, 10)
    const monthIndex = parseInt(monthStr, 10) - 1

    const startDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`
    const lastDay = new Date(year, monthIndex + 1, 0).getDate()
    const endDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`

    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("category, amount")
      .eq("type", "expense")
      .gte("date", startDate)
      .lte("date", endDate)

    if (error) {
      console.error("Error fetching category distribution:", error)
      return []
    }

    const catTotals: Record<string, number> = {}
    let totalExpense = 0

    transactions?.forEach((tx) => {
      const amt = Number(tx.amount)
      catTotals[tx.category] = (catTotals[tx.category] || 0) + amt
      totalExpense += amt
    })

    return Object.entries(catTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  }
}
