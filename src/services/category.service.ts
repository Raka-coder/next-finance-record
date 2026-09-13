import { incomeCategories as defaultIncome, expenseCategories as defaultExpense } from "@/components/dashboard/transaction/transaction-categories"

const STORAGE_KEY_PREFIX = "finance_custom_categories_"

export interface CustomCategoriesState {
  income: string[]
  expense: string[]
}

export class CategoryService {
  private static getKey(userId?: string): string {
    return `${STORAGE_KEY_PREFIX}${userId || "global"}`
  }

  static getCategories(userId?: string): CustomCategoriesState {
    if (typeof window === "undefined") {
      return {
        income: [...defaultIncome],
        expense: [...defaultExpense],
      }
    }

    try {
      const stored = localStorage.getItem(this.getKey(userId))
      if (stored) {
        const parsed = JSON.parse(stored) as CustomCategoriesState
        return {
          income: Array.from(new Set([...defaultIncome, ...(parsed.income || [])])),
          expense: Array.from(new Set([...defaultExpense, ...(parsed.expense || [])])),
        }
      }
    } catch (e) {
      console.error("Error reading categories from localStorage:", e)
    }

    return {
      income: [...defaultIncome],
      expense: [...defaultExpense],
    }
  }

  static saveCategories(categories: CustomCategoriesState, userId?: string): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(this.getKey(userId), JSON.stringify(categories))
      window.dispatchEvent(new Event("categories-updated"))
    } catch (e) {
      console.error("Error saving categories to localStorage:", e)
    }
  }

  static addCategory(type: "income" | "expense", name: string, userId?: string): boolean {
    const trimmed = name.trim()
    if (!trimmed) return false

    const current = this.getCategories(userId)
    const list = current[type]

    if (list.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      return false // Already exists
    }

    current[type] = [...list, trimmed]
    this.saveCategories(current, userId)
    return true
  }

  static updateCategory(
    type: "income" | "expense",
    oldName: string,
    newName: string,
    userId?: string
  ): boolean {
    const trimmedNew = newName.trim()
    if (!trimmedNew) return false

    const current = this.getCategories(userId)
    const list = current[type]

    const index = list.findIndex((item) => item.toLowerCase() === oldName.toLowerCase())
    if (index === -1) return false

    list[index] = trimmedNew
    current[type] = list
    this.saveCategories(current, userId)
    return true
  }

  static deleteCategory(type: "income" | "expense", name: string, userId?: string): boolean {
    const current = this.getCategories(userId)
    current[type] = current[type].filter((item) => item.toLowerCase() !== name.toLowerCase())
    this.saveCategories(current, userId)
    return true
  }

  static resetToDefault(userId?: string): void {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(this.getKey(userId))
      window.dispatchEvent(new Event("categories-updated"))
    } catch (e) {
      console.error("Error resetting categories:", e)
    }
  }
}
