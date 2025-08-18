export interface ExportParams {
  email: string
  startDate?: string
  endDate?: string
}

export class ExportService {
  static async exportTransactionsCSV(params: ExportParams): Promise<boolean> {
    try {
      const searchParams = new URLSearchParams({
        email: params.email,
        ...(params.startDate && { start: params.startDate }),
        ...(params.endDate && { end: params.endDate }),
      })

      // console.log("Calling export API with params:", params)

      const response = await fetch(`/api/export?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      // console.log("Export API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Export API error:", errorData)
        throw new Error(errorData.error || `Export failed with status ${response.status}`)
      }

      // Check if response is CSV (successful export)
      const contentType = response.headers.get("content-type")
      if (contentType?.includes("text/csv")) {
        // Get filename from Content-Disposition header
        const contentDisposition = response.headers.get("content-disposition")
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
        const filename = filenameMatch ? filenameMatch[1] : "transaksi-keuangan.csv"

        // Create blob and download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        return true
      } else {
        // Handle JSON error response
        const errorData = await response.json().catch(() => ({ error: "Invalid response format" }))
        throw new Error(errorData.error || "Export failed")
      }
    } catch (error) {
      console.error("Export service error:", error)
      throw error
    }
  }

  static async getExportSummary(email: string) {
    try {
      // console.log("Getting export summary for email:", email)

      const response = await fetch(`/api/export/summary?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      // console.log("Summary API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Summary API error response:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }

        throw new Error(errorData.error || `Failed to get export summary (${response.status})`)
      }

      const data = await response.json()
      // console.log("Summary API success:", data)
      return data
    } catch (error) {
      console.error("Export summary service error:", error)
      throw error
    }
  }
}
