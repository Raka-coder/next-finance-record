import { supabase } from "@/utils/supabase/client"
import type { Transaction, TransactionInput } from "@/types/transaction"

export class TransactionService {
  static async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase.from("transactions").select("*").order("date", { ascending: false })

    if (error) {
      console.error("Error fetching transactions:", error)
      throw new Error("Failed to fetch transactions")
    }

    return data || []
  }

  static async addTransaction(transaction: TransactionInput): Promise<Transaction> {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        ...transaction,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding transaction:", error)
      throw new Error("Failed to add transaction")
    }

    return data
  }

  static async updateTransaction(id: string, transaction: TransactionInput): Promise<Transaction> {
    const { data, error } = await supabase.from("transactions").update(transaction).eq("id", id).select().single()

    if (error) {
      console.error("Error updating transaction:", error)
      throw new Error("Failed to update transaction")
    }

    return data
  }

  static async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase.from("transactions").delete().eq("id", id)

    if (error) {
      console.error("Error deleting transaction:", error)
      throw new Error("Failed to delete transaction")
    }
  }
}
