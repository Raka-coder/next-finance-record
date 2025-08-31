"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogoutDialog } from "@/components/dialog/logout-dialog"
import type { User } from "@supabase/supabase-js"

interface AccountManagementCardProps {
  user: User
}

export function AccountManagementCard({ }: AccountManagementCardProps) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  const handleSignOut = async () => {
    setIsLogoutDialogOpen(true)
  }

  return (
    <>
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Akun</CardTitle>
          <CardDescription>Kelola akun Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="mb-4 bg-transparent"
          >
            <LogOut className="size-4" />
            Keluar
          </Button>
        </CardContent>
      </Card>
      <LogoutDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onLogoutSuccess={() => {
          // Optional: Add any additional cleanup here
          console.log("User logged out successfully")
        }}
      />
    </>
  )
}