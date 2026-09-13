"use client"

import { useState } from "react"
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { useCategories } from "@/hooks/use-categories"

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

  const { incomeCategories, expenseCategories } = useCategories()

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
      toast.success("Transaksi dicatat")
      setOpen(false)
    } catch (error: unknown) {
      console.error("Error adding transaction:", error)
      toast.error((error as Error).message || "Gagal mencatat transaksi.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[420px] w-full p-6 border border-border bg-card">
        <DialogHeader className="p-0 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
              Catat Transaksi
            </DialogTitle>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Buku Kas
            </span>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Dokumentasikan penerimaan atau pengeluaran kas baru.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <TransactionTypeField control={form.control} />
            <TransactionAmountDateFields control={form.control} />
            <TransactionCategoryField control={form.control} categories={categories} />
            <TransactionDescriptionField control={form.control} />

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-border mt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="font-mono text-xs cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={form.formState.isSubmitting}
                className="font-mono text-xs cursor-pointer"
              >
                {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
