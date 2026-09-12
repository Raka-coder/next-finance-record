"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, RefreshCw, Check, Calendar, Edit2, Trash2, Clock, AlertCircle } from "lucide-react"
import { RecurringService } from "@/services/recurring.service"
import { RecurringFormDialog } from "./recurring-form-dialog"
import { toast } from "sonner"
import type { RecurringSchedule } from "@/interfaces/recurring-interface"

interface RecurringListProps {
  schedules: RecurringSchedule[]
  isLoading: boolean
  onRefresh: () => void
}

export function RecurringList({ schedules, isLoading, onRefresh }: RecurringListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<RecurringSchedule | null>(null)
  const [executingId, setExecutingId] = useState<string | null>(null)

  const today = new Date().toISOString().split("T")[0]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleToggleActive = async (schedule: RecurringSchedule) => {
    try {
      await RecurringService.toggleActive(schedule.id, !schedule.is_active)
      toast.success(
        !schedule.is_active
          ? `Jadwal "${schedule.description}" diaktifkan`
          : `Jadwal "${schedule.description}" dinonaktifkan`
      )
      onRefresh()
    } catch {
      toast.error("Gagal mengubah status jadwal")
    }
  }

  const handleExecute = async (schedule: RecurringSchedule) => {
    try {
      setExecutingId(schedule.id)
      await RecurringService.executeSchedule(schedule.id)
      toast.success(`Transaksi "${schedule.description}" berhasil dicatat ke pembukuan!`)
      onRefresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengeksekusi transaksi"
      toast.error(msg)
    } finally {
      setExecutingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus jadwal transaksi berulang ini?")) return
    try {
      await RecurringService.deleteSchedule(id)
      toast.success("Jadwal transaksi berhasil dihapus")
      onRefresh()
    } catch {
      toast.error("Gagal menghapus jadwal")
    }
  }

  const handleOpenEdit = (schedule: RecurringSchedule) => {
    setSelectedSchedule(schedule)
    setFormOpen(true)
  }

  const handleOpenCreate = () => {
    setSelectedSchedule(null)
    setFormOpen(true)
  }

  // Hitung estimasi komitmen bulanan
  const activeSchedules = schedules.filter((s) => s.is_active)
  const monthlyCommitment = activeSchedules.reduce((acc, curr) => {
    if (curr.type !== "expense") return acc
    const amt = Number(curr.amount)
    if (curr.frequency === "daily") return acc + amt * 30
    if (curr.frequency === "weekly") return acc + amt * 4
    if (curr.frequency === "monthly") return acc + amt
    if (curr.frequency === "yearly") return acc + Math.round(amt / 12)
    return acc
  }, 0)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Total Transaksi Rutin</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono tabular-nums">
              {schedules.length} Jadwal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {activeSchedules.length} aktif, {schedules.length - activeSchedules.length} nonaktif
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Estimasi Pengeluaran Rutin / Bulan</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono tabular-nums text-rose-500">
              {formatCurrency(monthlyCommitment)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Komitmen pengeluaran wajib setiap bulan</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Tindakan Cepat</CardDescription>
            <CardTitle className="text-base font-semibold">Otomasi Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Button onClick={handleOpenCreate} size="sm" className="w-full gap-1.5">
              <Plus className="size-4" />
              Tambah Jadwal Baru
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg font-medium">Daftar Tagihan & Transaksi Berulang</CardTitle>
            <CardDescription>
              Kelola tanggal jatuh tempo dan catat transaksi rutin ke pembukuan.
            </CardDescription>
          </div>
          <Button onClick={onRefresh} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="size-3.5" />
            Muat Ulang
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground">Memuat daftar jadwal...</div>
          ) : schedules.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="mx-auto size-12 rounded-full bg-muted flex items-center justify-center">
                <RefreshCw className="size-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-base">Belum Ada Transaksi Berulang</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Tambahkan pengeluaran rutin Anda agar aplikasi mengingatkan saat jatuh tempo.
              </p>
              <Button onClick={handleOpenCreate} size="sm" className="mt-2">
                Tambah Jadwal Pertama
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Nama Transaksi</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Frekuensi</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Jatuh Tempo</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => {
                    const isDue = schedule.is_active && schedule.next_due_date <= today
                    const isOverdue = schedule.is_active && schedule.next_due_date < today

                    return (
                      <TableRow key={schedule.id} className={!schedule.is_active ? "opacity-60" : ""}>
                        <TableCell>
                          <Switch
                            checked={schedule.is_active}
                            onCheckedChange={() => handleToggleActive(schedule)}
                          />
                        </TableCell>

                        <TableCell>
                          <div>
                            <span className="font-medium text-sm">{schedule.description}</span>
                            {isOverdue && (
                              <Badge className="ml-2 bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] py-0">
                                Terlewat
                              </Badge>
                            )}
                            {isDue && !isOverdue && (
                              <Badge className="ml-2 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] py-0">
                                Hari Ini
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {schedule.category}
                          </Badge>
                        </TableCell>

                        <TableCell className="capitalize text-xs text-muted-foreground">
                          {schedule.frequency === "daily"
                            ? "Harian"
                            : schedule.frequency === "weekly"
                            ? "Mingguan"
                            : schedule.frequency === "monthly"
                            ? "Bulanan"
                            : "Tahunan"}
                        </TableCell>

                        <TableCell className="font-mono tabular-nums font-semibold text-sm">
                          <span className={schedule.type === "expense" ? "text-rose-500" : "text-emerald-500"}>
                            {schedule.type === "expense" ? "-" : "+"}
                            {formatCurrency(Number(schedule.amount))}
                          </span>
                        </TableCell>

                        <TableCell className="text-xs font-mono">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-3 text-muted-foreground" />
                            <span>
                              {new Date(schedule.next_due_date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Tombol Catat Manual / Sekarang */}
                            <Button
                              size="sm"
                              variant={isDue ? "default" : "outline"}
                              className={`h-8 text-xs gap-1 ${
                                isDue
                                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                                  : ""
                              }`}
                              disabled={executingId === schedule.id}
                              onClick={() => handleExecute(schedule)}
                            >
                              {executingId === schedule.id ? (
                                <Clock className="size-3 animate-spin" />
                              ) : (
                                <Check className="size-3" />
                              )}
                              Catat
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-foreground"
                              onClick={() => handleOpenEdit(schedule)}
                            >
                              <Edit2 className="size-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-rose-500"
                              onClick={() => handleDelete(schedule.id)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {formOpen && (
        <RecurringFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          existingSchedule={selectedSchedule}
          onSuccess={onRefresh}
        />
      )}
    </div>
  )
}
