"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DialogTrigger } from "@/components/ui/dialog"
import { Settings, LogOut, Edit } from "lucide-react"
import type { Profile } from "@/types/profile-types"
import { ProfileEditDialog } from "./profile-edit-dialog"

interface UserDropdownMenuProps {
  profile: Profile
  onProfileUpdate: (updates: Partial<Profile>) => Promise<Profile | null>
  onOpenLogoutDialog: () => void
  onOpenEditDialog: () => void
  isEditDialogOpen: boolean
  onEditDialogOpenChange: (open: boolean) => void
}

export function UserDropdownMenu({
  profile,
  onProfileUpdate,
  onOpenLogoutDialog,
  onOpenEditDialog,
  isEditDialogOpen,
  onEditDialogOpenChange
}: UserDropdownMenuProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile.avatar_url || ""} alt={profile.username} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(profile.full_name || profile.username)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile.full_name || profile.username}</p>
              <p className="text-xs leading-none text-muted-foreground">@{profile.username}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem 
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                onOpenEditDialog();
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Profil</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <Link href="/dashboard/settings">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onOpenLogoutDialog} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Keluar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileEditDialog
        profile={profile}
        open={isEditDialogOpen}
        onOpenChange={onEditDialogOpenChange}
        onProfileUpdate={onProfileUpdate}
      />
    </>
  )
}