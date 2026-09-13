"use client"

import { useState, useEffect, useCallback } from "react"
import { CategoryService, type CustomCategoriesState } from "@/services/category.service"

export function useCategories(userId?: string) {
  const [categories, setCategories] = useState<CustomCategoriesState>(() =>
    CategoryService.getCategories(userId)
  )

  const refresh = useCallback(() => {
    setCategories(CategoryService.getCategories(userId))
  }, [userId])

  useEffect(() => {
    refresh()

    const handleUpdate = () => {
      refresh()
    }

    window.addEventListener("categories-updated", handleUpdate)
    return () => {
      window.removeEventListener("categories-updated", handleUpdate)
    }
  }, [refresh])

  const addCategory = (type: "income" | "expense", name: string) => {
    const success = CategoryService.addCategory(type, name, userId)
    if (success) refresh()
    return success
  }

  const updateCategory = (type: "income" | "expense", oldName: string, newName: string) => {
    const success = CategoryService.updateCategory(type, oldName, newName, userId)
    if (success) refresh()
    return success
  }

  const deleteCategory = (type: "income" | "expense", name: string) => {
    const success = CategoryService.deleteCategory(type, name, userId)
    if (success) refresh()
    return success
  }

  const resetToDefault = () => {
    CategoryService.resetToDefault(userId)
    refresh()
  }

  return {
    incomeCategories: categories.income,
    expenseCategories: categories.expense,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToDefault,
  }
}
