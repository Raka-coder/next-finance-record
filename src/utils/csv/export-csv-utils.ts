import type { Transaction } from "@/interfaces/transaction-interface"

export function exportToCSV(transactions: Transaction[], userEmail: string): boolean {
  try {
    // Define CSV headers
    const headers = ["Tanggal", "Jenis", "Jumlah", "Deskripsi", "Kategori", "Dibuat", "Diperbarui"]

    // Convert transactions to CSV format
    const csvData = transactions.map((transaction) => [
      formatDate(transaction.date),
      transaction.type === "income" ? "Pemasukan" : "Pengeluaran",
      transaction.amount.toString(),
      `"${transaction.description.replace(/"/g, '""')}"`, // Escape quotes
      transaction.category,
      formatDateTime(transaction.created_at),
      formatDateTime(transaction.updated_at),
    ])

    // Combine headers and data
    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = "\uFEFF"
    const csvWithBOM = BOM + csvContent

    // Create blob and download
    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
      const filename = `transaksi-keuangan-${timestamp}.csv`

      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      URL.revokeObjectURL(url)

      return true
    }

    return false
  } catch (error) {
    console.error("Error exporting CSV:", error)
    return false
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export function generateTransactionSummary(transactions: Transaction[]) {
  const totalTransactions = transactions.length
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  return {
    totalTransactions,
    totalIncome,
    totalExpense,
    balance,
    incomeCount: transactions.filter((t) => t.type === "income").length,
    expenseCount: transactions.filter((t) => t.type === "expense").length,
  }
}
