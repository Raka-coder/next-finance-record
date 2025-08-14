"use client"

import { usePathname, useRouter } from "next/navigation"
import { Wallet, Plus, List, BarChart3, SettingsIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    id: "summary",
    title: "Ringkasan Keuangan",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    id: "add",
    title: "Tambah Transaksi",
    icon: Plus,
    href: "/dashboard/add-transaction",
  },
  {
    id: "list",
    title: "Daftar Transaksi",
    icon: List,
    href: "/dashboard/transaction-lists",
  },
  {
    id: "settings",
    title: "Pengaturan",
    icon: SettingsIcon,
    href: "/dashboard/settings",
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
              onClick={() => router.push("/dashboard")}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Wallet className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Keuangan Saya</span>
                <span className="text-xs">Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton className="cursor-pointer" isActive={isActive(item.href)} onClick={() => router.push(item.href)}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
