import { SettingsIcon } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/interfaces/profile-interface"
import { ProfileSettingsCard } from "./settings/profile-settings-card"
import { NotificationSettingsCard } from "./settings/notification-settings-card"
import { AppearanceSettingsCard } from "./settings/appearance-settings-card"
import { DataManagementCard } from "./settings/data-management-card"
import { AccountManagementCard } from "./settings/account-management-card"

interface SettingsProps {
  user: User
  profile?: Profile | null
}

export function Settings({ user, profile = null }: SettingsProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon className="size-6" />
        <h1 className="text-2xl font-bold">Pengaturan</h1>
      </div>

      {/* Profile Settings */}
      <ProfileSettingsCard user={user} profile={profile} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <NotificationSettingsCard />

        {/* Appearance Settings */}
        <AppearanceSettingsCard />
      </div>

      {/* Data Management */}
      <DataManagementCard user={user} />

      {/* Account Management */}
      <AccountManagementCard user={user} />
    </div>
  )
}