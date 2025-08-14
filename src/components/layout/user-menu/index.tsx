"use client"

import { useState, useCallback } from "react"
import type { Profile } from "@/types/profile-types"
import { UserProfileDisplay } from "./user-profile-display"
import { UserDropdownMenu } from "./user-dropdown-menu"
import { ProfileCreateDialog } from "./profile-create-dialog"
import { LogoutDialog } from "@/components/dialog/logout-dialog"

interface UserMenuProps {
  profile: Profile | null
  onProfileUpdate: (updates: Partial<Profile>) => Promise<Profile | null>
  onProfileCreate?: (username: string, fullName?: string) => Promise<Profile | null>
  userEmail?: string
}

export function UserMenu({ profile, onProfileUpdate, onProfileCreate, userEmail }: UserMenuProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  const handleOpenEditDialog = useCallback(() => {
    setIsEditDialogOpen(true)
  }, [])

  const handleOpenCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(true)
  }, [])

  const handleOpenLogoutDialog = useCallback(() => {
    setIsLogoutDialogOpen(true)
  }, [])

  const handleEditDialogOpenChange = useCallback((open: boolean) => {
    setIsEditDialogOpen(open)
  }, [])

  const handleCreateDialogOpenChange = useCallback((open: boolean) => {
    setIsCreateDialogOpen(open)
  }, [])

  const handleLogoutDialogOpenChange = useCallback((open: boolean) => {
    setIsLogoutDialogOpen(open)
  }, [])

  return (
    <div className="flex items-center gap-3">
      <>
        <UserProfileDisplay 
          profile={profile} 
          userEmail={userEmail} 
          onOpenCreateDialog={handleOpenCreateDialog} 
        />
        {profile && (
          <UserDropdownMenu
            profile={profile}
            onProfileUpdate={onProfileUpdate}
            onOpenLogoutDialog={handleOpenLogoutDialog}
            onOpenEditDialog={handleOpenEditDialog}
            isEditDialogOpen={isEditDialogOpen}
            onEditDialogOpenChange={handleEditDialogOpenChange}
          />
        )}
        <ProfileCreateDialog
          open={isCreateDialogOpen}
          onOpenChange={handleCreateDialogOpenChange}
          onProfileCreate={onProfileCreate}
        />
        <LogoutDialog
          open={isLogoutDialogOpen}
          onOpenChange={handleLogoutDialogOpenChange}
          onLogoutSuccess={() => {
            // Optional: Add any additional cleanup here
            console.log("User logged out successfully")
          }}
        />
      </>
    </div>
  )
}