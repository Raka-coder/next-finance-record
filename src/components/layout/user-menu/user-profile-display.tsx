"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus } from "lucide-react"
import type { Profile } from "@/interfaces/profile-interface"
import { DialogTrigger } from "@/components/ui/dialog"

interface UserProfileDisplayProps {
  profile: Profile | null
  userEmail?: string
  onOpenCreateDialog: () => void
}

export function UserProfileDisplay({ profile, userEmail, onOpenCreateDialog }: UserProfileDisplayProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!profile) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-medium">{userEmail || "User"}</span>
          <Badge variant="outline" className="text-xs">
            Profile belum dibuat
          </Badge>
        </div>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" onClick={onOpenCreateDialog}>
            <UserPlus className="size-4 mr-2" />
            Buat Profile
          </Button>
        </DialogTrigger>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-sm font-medium">{profile.full_name || profile.username}</span>
        <Badge variant="secondary" className="text-xs">
          @{profile.username}
        </Badge>
      </div>
      <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile.avatar_url || ""} alt={profile.username} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(profile.full_name || profile.username)}
          </AvatarFallback>
        </Avatar>
      </Button>
    </div>
  )
}