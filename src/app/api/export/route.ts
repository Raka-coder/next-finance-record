import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Parser } from "json2csv"

// Supabase service role client (server-side only)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key for server-side operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const startDate = searchParams.get("start")
    const endDate = searchParams.get("end")

    // Validate required parameters
    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    // Get user by email first
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers()

    if (userError) {
      console.error("Error fetching users:", userError)
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }

    const user = userData.users.find((u) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Build query for transactions
    let query = supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })

    // Add date filters if provided
    if (startDate) {
      query = query.gte("date", startDate)
    }
    if (endDate) {
      query = query.lte("date", endDate)
    }

    const { data: transactions, error: transactionError } = await query

    if (transactionError) {
      console.error("Error fetching transactions:", transactionError)
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ error: "No transactions found" }, { status: 404 })
    }

    // Transform data for CSV export
    const csvData = transactions.map((transaction) => ({
      Tanggal: formatDate(transaction.date),
      Deskripsi: transaction.description,
      Kategori: transaction.category,
      Jenis: transaction.type === "income" ? "Pemasukan" : "Pengeluaran",
      Jumlah: formatCurrency(transaction.amount),
    }))

    // Define CSV fields
    const fields = ["Tanggal", "Deskripsi", "Kategori", "Jenis", "Jumlah"]

    // Create CSV parser
    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(csvData)

    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = "\uFEFF"
    const csvWithBOM = BOM + csv

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const filename = `transaksi-keuangan-${timestamp}.csv`

    // Return CSV file as download
    return new NextResponse(csvWithBOM, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}
