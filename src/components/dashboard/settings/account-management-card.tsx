"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogoutDialog } from "@/components/dialog/logout-dialog"
import type { User } from "@supabase/supabase-js"

interface AccountManagementCardProps {
  user: User
}

export function AccountManagementCard({ }: AccountManagementCardProps) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  return (
    <>
      <Card className="border border-border bg-card p-5 gap-0">
        <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
              Sesi & Keamanan
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Kelola sesi aktif akun Anda di peramban ini
            </CardDescription>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsLogoutDialogOpen(true)}
            className="font-mono text-xs"
          >
            Keluar dari Akun
          </Button>
        </CardHeader>
        <CardContent className="p-0" />
      </Card>

      <LogoutDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      />
    </>
  )
}