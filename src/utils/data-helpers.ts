import { startOfDay, endOfDay, addDays, parseISO, format } from 'date-fns'
import { id } from 'date-fns/locale'

export interface DateRange {
  start: Date
  end: Date
  label: string
}

/**
 * Create 7-day periods starting from the oldest date
 */
export function create7DayPeriods(dates: string[]): DateRange[] {
  if (dates.length === 0) return []

  // Sort dates and get the range
  const sortedDates = dates.sort()
  const oldestDate = startOfDay(parseISO(sortedDates[0]))
  const newestDate = startOfDay(parseISO(sortedDates[sortedDates.length - 1]))

  const periods: DateRange[] = []
  let currentStart = oldestDate

  // Create 7-day periods
  while (currentStart <= newestDate) {
    const currentEnd = endOfDay(addDays(currentStart, 6))
    
    // Check if any dates fall within this period
    const hasTransactionsInPeriod = dates.some(dateStr => {
      const date = startOfDay(parseISO(dateStr))
      return date >= currentStart && date <= currentEnd
    })

    if (hasTransactionsInPeriod) {
      periods.push({
        start: currentStart,
        end: currentEnd,
        label: formatDateRange(currentStart, currentEnd)
      })
    }

    currentStart = addDays(currentStart, 7)
  }

  return periods
}

/**
 * Format date range for display
 */
export function formatDateRange(start: Date, end: Date): string {
  // If same date, show single date
  if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
    return format(start, 'dd MMM yyyy', { locale: id })
  }
  
  // If same month, show "1-7 Jan 2024"
  if (format(start, 'yyyy-MM') === format(end, 'yyyy-MM')) {
    return `${format(start, 'dd', { locale: id })}-${format(end, 'dd MMM yyyy', { locale: id })}`
  }
  
  // If different months, show "28 Jan - 3 Feb 2024"
  return `${format(start, 'dd MMM', { locale: id })} - ${format(end, 'dd MMM yyyy', { locale: id })}`
}

/**
 * Check if a date falls within a date range
 */
export function isDateInRange(date: string, range: DateRange): boolean {
  const checkDate = startOfDay(parseISO(date))
  return checkDate >= range.start && checkDate <= range.end
}

/**
 * Group transactions by 7-day periods
 */
export function groupTransactionsByWeeks<T extends { date: string }>(
  transactions: T[]
): Array<{
  period: DateRange
  transactions: T[]
  weekNumber: number
}> {
  if (transactions.length === 0) return []

  // Get all unique dates
  const dates = [...new Set(transactions.map(t => t.date))]
  
  // Create 7-day periods
  const periods = create7DayPeriods(dates)
  
  // Group transactions by periods
  return periods.map((period, index) => ({
    period,
    transactions: transactions.filter(t => isDateInRange(t.date, period)),
    weekNumber: index + 1
  })).filter(group => group.transactions.length > 0)
}
