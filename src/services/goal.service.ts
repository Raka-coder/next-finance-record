import { createClient } from "@/utils/supabase/client"
import type { Goal, GoalInput } from "@/interfaces/budget-interface"

export class GoalService {
  private static getClient() {
    return createClient()
  }

  static async getGoals(): Promise<Goal[]> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching goals:", error)
      throw new Error("Gagal mengambil data target tabungan")
    }

    return data || []
  }

  static async createGoal(input: GoalInput): Promise<Goal> {
    const supabase = this.getClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Pengguna belum login")
    }

    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        name: input.name,
        target_amount: input.target_amount,
        current_amount: input.current_amount || 0,
        target_date: input.target_date || null,
        category: input.category || "Tabungan",
        color: input.color || "#10b981",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating goal:", error)
      throw new Error("Gagal menambahkan target tabungan")
    }

    return data
  }

  static async updateGoal(id: string, input: Partial<GoalInput>): Promise<Goal> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from("goals")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating goal:", error)
      throw new Error("Gagal memperbarui target tabungan")
    }

    return data
  }

  static async updateGoalProgress(id: string, amountDelta: number): Promise<Goal> {
    const supabase = this.getClient()
    
    // Ambil saldo target saat ini
    const { data: goal, error: fetchError } = await supabase
      .from("goals")
      .select("current_amount, target_amount")
      .eq("id", id)
      .single()

    if (fetchError || !goal) {
      throw new Error("Target tabungan tidak ditemukan")
    }

    const newAmount = Math.max(0, Number(goal.current_amount) + amountDelta)

    const { data, error } = await supabase
      .from("goals")
      .update({
        current_amount: newAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating goal balance:", error)
      throw new Error("Gagal mengubah nominal tabungan")
    }

    return data
  }

  static async deleteGoal(id: string): Promise<void> {
    const supabase = this.getClient()
    const { error } = await supabase.from("goals").delete().eq("id", id)

    if (error) {
      console.error("Error deleting goal:", error)
      throw new Error("Gagal menghapus target tabungan")
    }
  }
}
