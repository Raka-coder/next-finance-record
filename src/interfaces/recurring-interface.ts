export type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly"

export interface RecurringSchedule {
  id: string
  user_id?: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  frequency: RecurringFrequency
  next_due_date: string // 'YYYY-MM-DD'
  last_executed_at?: string | null
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface RecurringScheduleInput {
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  frequency: RecurringFrequency
  next_due_date: string
  is_active?: boolean
}
