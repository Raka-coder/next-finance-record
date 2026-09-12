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
      toast.success("Transaksi berhasil dicatat!")
      setOpen(false)
    } catch (error: unknown) {
      console.error("Error adding transaction:", error)
      toast.error((error as Error).message || "Gagal mencatat transaksi. Silakan coba lagi.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[460px] w-full p-0 overflow-hidden border-border/80 shadow-lg">
        {/* Header Dialog yang Rapi dan Bersih */}
        <div className="p-6 pb-4 border-b bg-muted/20">
          <DialogHeader className="space-y-1 text-left">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Plus className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold tracking-tight">Catat Transaksi</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Isi detail penerimaan atau pengeluaran keuangan Anda
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body Form yang Terstruktur Rapi */}
        <div className="p-6 pt-4 max-h-[80vh] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TransactionTypeField control={form.control} />
              <TransactionAmountDateFields control={form.control} />
              <TransactionCategoryField control={form.control} categories={categories} />
              <TransactionDescriptionField control={form.control} />

              <div className="pt-2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-1/3 rounded-xl cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-2/3 rounded-xl cursor-pointer font-semibold"
                >
                  {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
