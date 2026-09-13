"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/interfaces/profile-interface"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettingsCard } from "./settings/profile-settings-card"
import { AppearanceSettingsCard } from "./settings/appearance-settings-card"
import { CategorySettingsCard } from "./settings/category-settings-card"
import { SecuritySettingsCard } from "./settings/security-settings-card"
import { DataManagementCard } from "./settings/data-management-card"
import { UserCog, Tag, Shield, Database } from "lucide-react"

interface SettingsProps {
  user: User
  profile?: Profile | null
  onProfileUpdate?: () => void
}

export function Settings({ user, profile = null, onProfileUpdate }: SettingsProps) {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="max-w-4xl space-y-6">
      <div className="pb-4 border-b border-border">
        <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
          Preferensi
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Pengaturan Akun
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola profil pengguna, preferensi tema, pos kategori transaksi, keamanan, dan cadangan data.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 max-w-2xl h-auto p-1 bg-secondary/60">
          <TabsTrigger value="profile" className="text-xs font-mono gap-1.5 py-1.5 cursor-pointer">
            <UserCog className="size-3.5" />
            <span>Profil & Tema</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-xs font-mono gap-1.5 py-1.5 cursor-pointer">
            <Tag className="size-3.5" />
            <span>Kategori</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs font-mono gap-1.5 py-1.5 cursor-pointer">
            <Shield className="size-3.5" />
            <span>Keamanan</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="text-xs font-mono gap-1.5 py-1.5 cursor-pointer">
            <Database className="size-3.5" />
            <span>Ekspor Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profil & Tema */}
        <TabsContent value="profile" className="space-y-6 m-0">
          <ProfileSettingsCard user={user} profile={profile} onProfileUpdate={onProfileUpdate} />
          <AppearanceSettingsCard />
        </TabsContent>

        {/* Tab 2: Kategori Transaksi */}
        <TabsContent value="categories" className="space-y-6 m-0">
          <CategorySettingsCard userId={user.id} />
        </TabsContent>

        {/* Tab 3: Keamanan & Sesi */}
        <TabsContent value="security" className="space-y-6 m-0">
          <SecuritySettingsCard user={user} />
        </TabsContent>

        {/* Tab 4: Manajemen Data */}
        <TabsContent value="data" className="space-y-6 m-0">
          <DataManagementCard user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}