import { createClient } from "@/utils/supabase/client"
import type { Budget, BudgetInput, BudgetProgress } from "@/interfaces/budget-interface"

export class BudgetService {
  private static getClient() {
    return createClient()
  }

  static async getBudgets(month: string): Promise<Budget[]> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("month", month)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching budgets:", error)
      throw new Error("Gagal mengambil data anggaran")
    }

    return data || []
  }

  static async upsertBudget(input: BudgetInput): Promise<Budget> {
    const supabase = this.getClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Pengguna belum login")
    }

    const { data, error } = await supabase
      .from("budgets")
      .upsert(
        {
          user_id: user.id,
          category: input.category,
          amount: input.amount,
          month: input.month,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id, category, month" }
      )
      .select()
      .single()

    if (error) {
      console.error("Error saving budget:", error)
      throw new Error("Gagal menyimpan anggaran")
    }

    return data
  }

  static async deleteBudget(id: string): Promise<void> {
    const supabase = this.getClient()
    const { error } = await supabase.from("budgets").delete().eq("id", id)

    if (error) {
      console.error("Error deleting budget:", error)
      throw new Error("Gagal menghapus anggaran")
    }
  }

  /**
   * Mengambil progres anggaran bulanan:
   * Membandingkan batas alokasi anggaran dengan realisasi pengeluaran pada bulan yang sama.
   */
  static async getBudgetProgress(month: string): Promise<BudgetProgress[]> {
    const supabase = this.getClient()
    
    // 1. Ambil anggaran untuk bulan ini
    const budgets = await this.getBudgets(month)
    if (budgets.length === 0) return []

    // 2. Hitung rentang tanggal bulan (contoh: '2026-09-01' s/d '2026-09-30')
    const [yearStr, monthStr] = month.split("-")
    const year = parseInt(yearStr, 10)
    const monthIndex = parseInt(monthStr, 10) - 1
    const startDate = new Date(year, monthIndex, 1).toISOString()
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999).toISOString()

    // 3. Ambil pengeluaran pada rentang waktu ini
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("category, amount")
      .eq("type", "expense")
      .gte("date", startDate)
      .lte("date", endDate)

    if (error) {
      console.error("Error fetching transactions for budget comparison:", error)
      throw new Error("Gagal menghitung realisasi anggaran")
    }

    // Hitung total pengeluaran per kategori
    const spentByCategory: Record<string, number> = {}
    transactions?.forEach((tx) => {
      const cat = tx.category
      spentByCategory[cat] = (spentByCategory[cat] || 0) + Number(tx.amount)
    })

    return budgets.map((b) => {
      const spent = spentByCategory[b.category] || 0
      const budgeted = Number(b.amount)
      const remaining = budgeted - spent
      const percentage = budgeted > 0 ? Math.round((spent / budgeted) * 100) : 0

      return {
        id: b.id,
        category: b.category,
        budgeted,
        spent,
        remaining,
        percentage,
        isWarning: percentage >= 80 && percentage <= 100,
        isOver: percentage > 100,
      }
    })
  }
}
