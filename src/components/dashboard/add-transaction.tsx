"use client"

import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { transactionFormSchema, type TransactionFormValues } from "@/validation/schemas/add-transaction"
import type { Transaction } from "@/interfaces/transaction-interface"

import { TransactionTypeField } from "./transaction/transaction-type-field"
import { TransactionAmountDateFields } from "./transaction/transaction-amount-date-fields"
import { TransactionCategoryField } from "./transaction/transaction-category-field"
import { TransactionDescriptionField } from "./transaction/transaction-description-field"
import { incomeCategories, expenseCategories } from "./transaction/transaction-categories"

interface AddTransactionProps {
  onAddTransaction: (
    transaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">,
  ) => Promise<Transaction>
}

export function AddTransaction({ onAddTransaction }: AddTransactionProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "income",
      amount: "",
      description: "",
      category: "",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  })

  const type = form.watch("type")
  const categories = type === "income" ? incomeCategories : expenseCategories

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      // Validasi dan konversi amount
      const amount = Number.parseFloat(data.amount)
      if (isNaN(amount)) {
        toast.error("Jumlah transaksi tidak valid")
        return
      }

      // Validasi format tanggal
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(data.date)) {
        toast.error("Format tanggal tidak valid")
        return
      }

      await onAddTransaction({
        type: data.type,
        amount: amount,
        description: data.description,
        category: data.category,
        date: data.date,
      })

      form.reset()
      toast.success("Transaksi berhasil ditambahkan!")
    } catch (error: any) {
      console.error("Error adding transaction:", error)
      toast.error(error.message || "Gagal menambahkan transaksi. Silakan coba lagi.")
    } finally {
      form.resetField("amount")
      form.resetField("description")
      form.resetField("category")
      form.resetField("date")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="size-5" />
            Tambah Transaksi Baru
          </CardTitle>
          <CardDescription>Tambahkan transaksi pemasukan atau pengeluaran baru</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TransactionTypeField control={form.control} />
              <TransactionAmountDateFields control={form.control} />
              <TransactionCategoryField control={form.control} categories={categories} />
              <TransactionDescriptionField control={form.control} />
              
              <Button type="submit" className="w-full cursor-pointer">
                <Plus className="size-4 mt-0.5" />
                Tambah Transaksi
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
