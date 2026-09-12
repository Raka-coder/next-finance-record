export interface Budget {
  id: string
  user_id?: string
  category: string
  amount: number
  month: string // 'YYYY-MM'
  created_at?: string
  updated_at?: string
}

export interface BudgetInput {
  category: string
  amount: number
  month: string // 'YYYY-MM'
}

export interface BudgetProgress {
  id?: string
  category: string
  budgeted: number
  spent: number
  remaining: number
  percentage: number
  isWarning: boolean // > 80%
  isOver: boolean    // > 100%
}

export interface Goal {
  id: string
  user_id?: string
  name: string
  target_amount: number
  current_amount: number
  target_date?: string | null
  category: string
  color: string
  created_at?: string
  updated_at?: string
}

export interface GoalInput {
  name: string
  target_amount: number
  current_amount?: number
  target_date?: string | null
  category?: string
  color?: string
}
