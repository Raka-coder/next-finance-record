"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Profile } from "@/interfaces/profile-interface"
import { LogoutDialog } from "@/components/dialog/logout-dialog"
import Link from "next/link"

interface UserMenuProps {
  profile: Profile | null
  onProfileUpdate?: (updates: Partial<Profile>) => Promise<Profile | null>
  onProfileCreate?: (username: string, fullName?: string) => Promise<Profile | null>
  userEmail?: string
}

export function UserMenu({ profile, userEmail }: UserMenuProps) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const router = useRouter()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const displayName = profile?.full_name || profile?.username || userEmail?.split("@")[0] || "User"
  const handleTag = profile?.username ? `@${profile.username}` : (userEmail || "")

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col items-end leading-tight">
        <span className="text-xs font-medium text-foreground truncate max-w-[150px]">
          {displayName}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[150px]">
          {handleTag}
        </span>
      </div>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="relative size-7 rounded-[4px] border border-border flex items-center justify-center overflow-hidden hover:opacity-85 transition-opacity cursor-pointer">
            <Avatar className="size-7 rounded-[3px]">
              <AvatarImage src={profile?.avatar_url || ""} alt={displayName} />
              <AvatarFallback className="bg-secondary text-foreground text-[10px] font-mono font-medium rounded-[3px]">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-0.5">
              <span className="text-xs font-medium text-foreground truncate">{displayName}</span>
              <span className="text-[10px] font-mono text-muted-foreground truncate">{handleTag}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="w-full cursor-pointer">
              <span>Pengaturan</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <span>Keluar Akun</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutDialog 
        open={isLogoutDialogOpen} 
        onOpenChange={setIsLogoutDialogOpen}
        onLogoutSuccess={() => router.push("/login")}
      />
    </div>
  )
}