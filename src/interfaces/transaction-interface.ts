export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
  created_at: string
  updated_at: string
}

export interface TransactionInput {
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}
