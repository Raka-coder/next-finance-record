"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCategories } from "@/hooks/use-categories"
import { toast } from "sonner"
import { Plus, Tag, Edit2, Trash2, RotateCcw } from "lucide-react"

interface CategorySettingsCardProps {
  userId?: string
}

export function CategorySettingsCard({ userId }: CategorySettingsCardProps) {
  const {
    incomeCategories,
    expenseCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    resetToDefault,
  } = useCategories(userId)

  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense")
  const [newCatName, setNewCatName] = useState("")
  const [editingItem, setEditingItem] = useState<{ type: "income" | "expense"; name: string } | null>(null)
  const [editInput, setEditInput] = useState("")
  const [deletingItem, setDeletingItem] = useState<{ type: "income" | "expense"; name: string } | null>(null)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newCatName.trim()
    if (!trimmed) return

    const success = addCategory(activeTab, trimmed)
    if (success) {
      toast.success(`Kategori "${trimmed}" berhasil ditambahkan`)
      setNewCatName("")
    } else {
      toast.error(`Kategori "${trimmed}" sudah ada atau tidak valid`)
    }
  }

  const handleStartEdit = (type: "income" | "expense", name: string) => {
    setEditingItem({ type, name })
    setEditInput(name)
  }

  const handleConfirmEdit = () => {
    if (!editingItem) return
    const trimmed = editInput.trim()
    if (!trimmed) return

    const success = updateCategory(editingItem.type, editingItem.name, trimmed)
    if (success) {
      toast.success(`Kategori diperbarui menjadi "${trimmed}"`)
      setEditingItem(null)
    } else {
      toast.error("Gagal memperbarui kategori atau nama sudah digunakan")
    }
  }

  const handleConfirmDelete = () => {
    if (!deletingItem) return
    deleteCategory(deletingItem.type, deletingItem.name)
    toast.success(`Kategori "${deletingItem.name}" telah dihapus`)
    setDeletingItem(null)
  }

  const currentList = activeTab === "expense" ? expenseCategories : incomeCategories

  return (
    <div className="space-y-6">
      <Card className="border border-border bg-card p-5 gap-0 shadow-none rounded-md">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="size-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold tracking-tight">
                Pos Kategori Transaksi
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                resetToDefault()
                toast.success("Kategori dikembalikan ke setelan standar")
              }}
              className="h-7 px-2 font-mono text-[11px] text-muted-foreground hover:text-foreground gap-1 cursor-pointer"
            >
              <RotateCcw className="size-3" />
              Reset Default
            </Button>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Sesuaikan klasifikasi kategori pos kas masuk dan keluar sesuai kebutuhan finansial Anda
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 pt-2 space-y-5">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "expense" | "income")}>
            <TabsList className="grid w-full max-w-[320px] grid-cols-2 mb-4">
              <TabsTrigger value="expense" className="text-xs font-mono">
                Pengeluaran ({expenseCategories.length})
              </TabsTrigger>
              <TabsTrigger value="income" className="text-xs font-mono">
                Pemasukan ({incomeCategories.length})
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleAdd} className="flex gap-2 mb-4">
              <Input
                placeholder={`Tambah kategori ${activeTab === "expense" ? "pengeluaran" : "pemasukan"} baru...`}
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="font-mono text-xs max-w-sm"
              />
              <Button type="submit" size="sm" className="font-mono text-xs gap-1 cursor-pointer">
                <Plus className="size-3.5" />
                Tambah
              </Button>
            </form>

            <TabsContent value={activeTab} className="m-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {currentList.map((cat) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between px-3 py-2 rounded-[4px] border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors"
                  >
                    <span className="text-xs font-medium text-foreground truncate pr-2">
                      {cat}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={() => handleStartEdit(activeTab, cat)}
                      >
                        <Edit2 className="size-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-6 text-muted-foreground hover:text-[#9F2F2D] cursor-pointer"
                        onClick={() => setDeletingItem({ type: activeTab, name: cat })}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog Edit Kategori */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Ubah Nama Kategori</DialogTitle>
            <DialogDescription className="text-xs">
              Ubah penamaan kategori "{editingItem?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              placeholder="Nama kategori baru"
              className="font-mono text-xs"
              autoFocus
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingItem(null)}
              className="font-mono text-xs"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmEdit}
              className="font-mono text-xs"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Hapus Kategori */}
      <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-[#9F2F2D] dark:text-[#F87171]">
              Hapus Kategori
            </DialogTitle>
            <DialogDescription className="text-xs">
              Apakah Anda yakin ingin menghapus kategori "{deletingItem?.name}"? Transaksi yang sudah dicatat dengan kategori ini tetap aman.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingItem(null)}
              className="font-mono text-xs"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              className="font-mono text-xs"
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
