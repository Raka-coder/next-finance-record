"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { UserMenu } from "@/components/layout/user-menu"
import { useProfile } from "@/hooks/use-profile"
import { useAuth } from "@/hooks/use-auth"
import LoadingGlobal from "@/components/loading/loading-global"
import LoadingToLogin from "@/components/loading/loading-to-login"

const menuItems = [
  {
    id: "summary",
    title: "Ringkasan Keuangan",
    href: "/dashboard",
  },
  {
    id: "list",
    title: "Daftar Transaksi",
    href: "/dashboard/transaction-lists",
  },
  {
    id: "recurring",
    title: "Tagihan Berulang",
    href: "/dashboard/recurring",
  },
  {
    id: "budgets-goals",
    title: "Anggaran & Target",
    href: "/dashboard/budgets-goals",
  },
  {
    id: "settings",
    title: "Pengaturan",
    href: "/dashboard/settings",
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, isAuthenticated, redirectToLogin } = useAuth()
  const pathname = usePathname()

  const { profile, updateProfile, createProfile } = useProfile(user?.id)

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      redirectToLogin()
    }
  }, [loading, isAuthenticated, user, redirectToLogin])



  const getPageTitle = () => {
    const exactMatch = menuItems.find(item => item.href === pathname)
    if (exactMatch) {
      return exactMatch.title
    }
    
    const partialMatch = menuItems.find(item => pathname.startsWith(item.href))
    if (partialMatch) {
      return partialMatch.title
    }
    
    return "Dashboard"
  }

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)

    if (segments.length === 1 && segments[0] === "dashboard") {
      return (
        <BreadcrumbList className="font-mono text-xs text-muted-foreground">
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">Buku Kas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      )
    }

    return (
      <BreadcrumbList className="font-mono text-xs text-muted-foreground">
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard" className="hover:text-foreground">Buku Kas</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-foreground font-medium">{getPageTitle()}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    )
  }

  if (loading) {
    return <LoadingGlobal />
  }

  if (!isAuthenticated || !user) {
    return <LoadingToLogin />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4 bg-background/80 backdrop-blur-xs">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
          <Separator orientation="vertical" className="mr-2 h-3.5 bg-border" />
          <Breadcrumb>{getBreadcrumbs()}</Breadcrumb>

          <div className="ml-auto">
            <UserMenu
              profile={profile}
              onProfileUpdate={updateProfile}
              onProfileCreate={createProfile}
              userEmail={user.email}
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}