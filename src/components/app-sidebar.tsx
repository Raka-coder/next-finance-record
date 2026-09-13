"use client"

import { usePathname, useRouter } from "next/navigation"
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
import {
  LayoutDashboard,
  ReceiptText,
  Repeat,
  Target,
  Settings,
} from "lucide-react"

const menuItems = [
  {
    id: "summary",
    title: "Ringkasan Keuangan",
    shortCode: "01",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "list",
    title: "Daftar Transaksi",
    shortCode: "02",
    href: "/dashboard/transaction-lists",
    icon: ReceiptText,
  },
  {
    id: "recurring",
    title: "Tagihan Berulang",
    shortCode: "03",
    href: "/dashboard/recurring",
    icon: Repeat,
  },
  {
    id: "budgets-goals",
    title: "Anggaran & Target",
    shortCode: "04",
    href: "/dashboard/budgets-goals",
    icon: Target,
  },
  {
    id: "settings",
    title: "Pengaturan",
    shortCode: "05",
    href: "/dashboard/settings",
    icon: Settings,
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
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader className="border-b border-border/70 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="FinanceRecord"
              className="hover:bg-sidebar-accent cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              <div className="size-6 shrink-0 rounded-[3px] bg-primary text-primary-foreground flex items-center justify-center font-mono text-[11px] font-bold">
                FR
              </div>
              <div className="flex flex-col gap-0.5 leading-none min-w-0 group-data-[collapsible=icon]:hidden">
                <span className="font-semibold text-xs tracking-tight truncate">FinanceRecord</span>
                <span className="text-[10px] font-mono text-muted-foreground truncate">v1.0 &middot; Buku Kas</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-2 mb-1">
            Navigasi
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="cursor-pointer rounded-[4px] text-xs h-8 font-normal data-[active=true]:font-medium data-[active=true]:bg-sidebar-accent"
                      isActive={isActive(item.href)}
                      onClick={() => router.push(item.href)}
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground group-data-[active=true]/menu-item:text-foreground" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
