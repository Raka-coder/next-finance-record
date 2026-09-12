-- ==============================================================================
-- Migration: 20260912_feature_expansion.sql
-- Description: Tables and RLS policies for:
--   1. budgets (Category monthly limits)
--   2. goals (Savings goals and tracking)
--   3. recurring_schedules (Recurring transactions & billing reminders)
-- ==============================================================================

-- 1. TABEL ANGGARAN (BUDGETS)
CREATE TABLE IF NOT EXISTS budgets (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  month TEXT NOT NULL, -- Format: 'YYYY-MM' (e.g. '2026-09')
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_category_month UNIQUE (user_id, category, month)
);

-- Index for fast queries by user and month
CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON budgets(user_id, month);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own budgets"
ON budgets FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets"
ON budgets FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
ON budgets FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
ON budgets FOR DELETE TO authenticated
USING (auth.uid() = user_id);


-- 2. TABEL TARGET TABUNGAN (GOALS)
CREATE TABLE IF NOT EXISTS goals (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  target_date DATE,
  category TEXT DEFAULT 'Tabungan',
  color TEXT DEFAULT '#10b981',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries by user
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goals"
ON goals FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
ON goals FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
ON goals FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
ON goals FOR DELETE TO authenticated
USING (auth.uid() = user_id);


-- 3. TABEL TRANSAKSI BERULANG (RECURRING_SCHEDULES)
CREATE TABLE IF NOT EXISTS recurring_schedules (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  next_due_date DATE NOT NULL,
  last_executed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast queries by user, active status, and due date
CREATE INDEX IF NOT EXISTS idx_recurring_user_due ON recurring_schedules(user_id, is_active, next_due_date);

ALTER TABLE recurring_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recurring schedules"
ON recurring_schedules FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recurring schedules"
ON recurring_schedules FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring schedules"
ON recurring_schedules FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring schedules"
ON recurring_schedules FOR DELETE TO authenticated
USING (auth.uid() = user_id);
