import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/interfaces/profile-interface"
import { ProfileSettingsCard } from "./settings/profile-settings-card"
import { AppearanceSettingsCard } from "./settings/appearance-settings-card"
import { DataManagementCard } from "./settings/data-management-card"
import { AccountManagementCard } from "./settings/account-management-card"

interface SettingsProps {
  user: User
  profile?: Profile | null
}

export function Settings({ user, profile = null }: SettingsProps) {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="pb-4 border-b border-border">
        <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
          Preferensi
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          Pengaturan Akun
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola profil pengguna, preferensi visual tema, dan ekspor data pembukuan.
        </p>
      </div>

      {/* Profile Settings */}
      <ProfileSettingsCard user={user} profile={profile} />

      {/* Appearance Settings */}
      <AppearanceSettingsCard />

      {/* Data Management */}
      <DataManagementCard user={user} />

      {/* Account Management */}
      <AccountManagementCard user={user} />
    </div>
  )
}