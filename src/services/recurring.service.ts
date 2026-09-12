import { createClient } from "@/utils/supabase/client"
import { TransactionService } from "@/services/transaction.service"
import type { RecurringSchedule, RecurringScheduleInput, RecurringFrequency } from "@/interfaces/recurring-interface"

export class RecurringService {
  private static getClient() {
    return createClient()
  }

  static async getRecurringSchedules(): Promise<RecurringSchedule[]> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from("recurring_schedules")
      .select("*")
      .order("next_due_date", { ascending: true })

    if (error) {
      console.error("Error fetching recurring schedules:", error)
      throw new Error("Gagal mengambil daftar transaksi berulang")
    }

    return data || []
  }

  /**
   * Mengambil jadwal transaksi berulang yang aktif dan sudah jatuh tempo (next_due_date <= hari ini)
   */
  static async getDueSchedules(): Promise<RecurringSchedule[]> {
    const supabase = this.getClient()
    const today = new Date().toISOString().split("T")[0] // 'YYYY-MM-DD'

    const { data, error } = await supabase
      .from("recurring_schedules")
      .select("*")
      .eq("is_active", true)
      .lte("next_due_date", today)
      .order("next_due_date", { ascending: true })

    if (error) {
      console.error("Error fetching due schedules:", error)
      return []
    }

    return data || []
  }

  static async createSchedule(input: RecurringScheduleInput): Promise<RecurringSchedule> {
    const supabase = this.getClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Pengguna belum login")
    }

    const { data, error } = await supabase
      .from("recurring_schedules")
      .insert({
        user_id: user.id,
        description: input.description,
        amount: input.amount,
        type: input.type,
        category: input.category,
        frequency: input.frequency,
        next_due_date: input.next_due_date,
        is_active: input.is_active ?? true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating recurring schedule:", error)
      throw new Error("Gagal menambahkan transaksi berulang")
    }

    return data
  }

  static async updateSchedule(id: string, input: Partial<RecurringScheduleInput>): Promise<RecurringSchedule> {
    const supabase = this.getClient()
    const { data, error } = await supabase
      .from("recurring_schedules")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating recurring schedule:", error)
      throw new Error("Gagal memperbarui transaksi berulang")
    }

    return data
  }

  static async toggleActive(id: string, isActive: boolean): Promise<void> {
    const supabase = this.getClient()
    const { error } = await supabase
      .from("recurring_schedules")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.error("Error toggling recurring status:", error)
      throw new Error("Gagal mengubah status transaksi berulang")
    }
  }

  static async deleteSchedule(id: string): Promise<void> {
    const supabase = this.getClient()
    const { error } = await supabase.from("recurring_schedules").delete().eq("id", id)

    if (error) {
      console.error("Error deleting recurring schedule:", error)
      throw new Error("Gagal menghapus transaksi berulang")
    }
  }

  /**
   * Menghitung tanggal jatuh tempo berikutnya berdasarkan frekuensi
   */
  static calculateNextDueDate(currentDueDateStr: string, frequency: RecurringFrequency): string {
    const date = new Date(currentDueDateStr)

    switch (frequency) {
      case "daily":
        date.setDate(date.getDate() + 1)
        break
      case "weekly":
        date.setDate(date.getDate() + 7)
        break
      case "monthly":
        date.setMonth(date.getMonth() + 1)
        break
      case "yearly":
        date.setFullYear(date.getFullYear() + 1)
        break
    }

    return date.toISOString().split("T")[0]
  }

  /**
   * Mengeksekusi jadwal yang jatuh tempo:
   * 1. Catat ke tabel transaksi riil via TransactionService
   * 2. Perbarui next_due_date dan last_executed_at
   */
  static async executeSchedule(scheduleId: string): Promise<void> {
    const supabase = this.getClient()

    // 1. Ambil detail jadwal
    const { data: schedule, error: fetchErr } = await supabase
      .from("recurring_schedules")
      .select("*")
      .eq("id", scheduleId)
      .single()

    if (fetchErr || !schedule) {
      throw new Error("Jadwal transaksi tidak ditemukan")
    }

    // 2. Tambah transaksi ke tabel transactions
    await TransactionService.addTransaction({
      description: `${schedule.description} (Otomatis)`,
      amount: Number(schedule.amount),
      type: schedule.type,
      category: schedule.category,
      date: new Date().toISOString(),
    })

    // 3. Hitung tanggal jatuh tempo berikutnya
    const nextDate = this.calculateNextDueDate(schedule.next_due_date, schedule.frequency)

    // 4. Update data jadwal
    const { error: updateErr } = await supabase
      .from("recurring_schedules")
      .update({
        last_executed_at: new Date().toISOString(),
        next_due_date: nextDate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", scheduleId)

    if (updateErr) {
      console.error("Error advancing recurring schedule date:", updateErr)
      throw new Error("Gagal memperbarui jadwal jatuh tempo berikutnya")
    }
  }
}
