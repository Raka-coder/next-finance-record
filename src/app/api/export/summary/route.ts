import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Supabase service role client
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    // console.log("Summary API called with email:", email)

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    // Get user by email using auth admin
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers()

    if (userError) {
      console.error("Error fetching users:", userError)
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }

    const user = userData.users.find((u) => u.email === email)
    if (!user) {
      // console.log("User not found for email:", email)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // console.log("Found user:", user.id)

    // Get transaction summary
    const { data: transactions, error: transactionError } = await supabaseAdmin
      .from("transactions")
      .select("type, amount")
      .eq("user_id", user.id)

    if (transactionError) {
      console.error("Error fetching transactions:", transactionError)
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    // console.log("Found transactions:", transactions?.length || 0)

    const totalIncome = transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0) || 0
    const totalExpense = transactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0) || 0

    const summary = {
      totalTransactions: transactions?.length || 0,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeCount: transactions?.filter((t) => t.type === "income").length || 0,
      expenseCount: transactions?.filter((t) => t.type === "expense").length || 0,
    }

    // console.log("Summary result:", summary)

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Summary API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
