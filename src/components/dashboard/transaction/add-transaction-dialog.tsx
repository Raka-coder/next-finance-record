"use client"

import { useState } from "react"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { transactionFormSchema, type TransactionFormValues } from "@/validation/schemas/add-transaction"
import type { Transaction } from "@/interfaces/transaction-interface"

import { TransactionTypeField } from "./transaction-type-field"
import { TransactionAmountDateFields } from "./transaction-amount-date-fields"
import { TransactionCategoryField } from "./transaction-category-field"
import { TransactionDescriptionField } from "./transaction-description-field"
import { incomeCategories, expenseCategories } from "./transaction-categories"

interface AddTransactionDialogProps {
  onAddTransaction: (
    transaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">
  ) => Promise<Transaction>
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddTransactionDialog({
  onAddTransaction,
  trigger,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: AddTransactionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = externalOpen !== undefined
  const open = isControlled ? externalOpen : internalOpen
  const setOpen = isControlled ? (externalOnOpenChange ?? (() => {})) : setInternalOpen

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
      const amount = Number.parseFloat(data.amount)
      if (isNaN(amount) || amount <= 0) {
        toast.error("Jumlah transaksi harus lebih dari 0")
        return
      }

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

      form.reset({
        type: "income",
        amount: "",
        description: "",
        category: "",
        date: format(new Date(), "yyyy-MM-dd"),
      })
      toast.success("Transaksi berhasil ditambahkan!")
      setOpen(false)
    } catch (error: unknown) {
      console.error("Error adding transaction:", error)
      toast.error((error as Error).message || "Gagal menambahkan transaksi. Silakan coba lagi.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className="font-medium gap-1.5 shadow-sm">
            <Plus className="size-4" />
            <span>Tambah Transaksi</span>
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Plus className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Tambah Transaksi Baru</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Catat arus kas pemasukan atau pengeluaran baru Anda
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <TransactionTypeField control={form.control} />
            <TransactionAmountDateFields control={form.control} />
            <TransactionCategoryField control={form.control} categories={categories} />
            <TransactionDescriptionField control={form.control} />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full cursor-pointer mt-2"
            >
              {form.formState.isSubmitting ? (
                "Menyimpan..."
              ) : (
                <>
                  <Plus className="size-4 mr-1.5" /> Simpan Transaksi
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
