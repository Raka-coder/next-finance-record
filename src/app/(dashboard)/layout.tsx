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

// Import menu items for consistent naming
const menuItems = [
  {
    id: "summary",
    title: "Ringkasan Keuangan",
    href: "/dashboard",
  },
  {
    id: "add",
    title: "Tambah Transaksi",
    href: "/dashboard/add-transaction",
  },
  {
    id: "list",
    title: "Daftar Transaksi",
    href: "/dashboard/transaction-lists",
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
    // Redirect to login if not authenticated and not already loading
    if (!loading && !isAuthenticated) {
      redirectToLogin()
    }
  }, [loading, isAuthenticated, redirectToLogin])

  // Function to get page title based on pathname using sidebar menu data
  const getPageTitle = () => {
    // Find exact match first
    const exactMatch = menuItems.find(item => item.href === pathname)
    if (exactMatch) {
      return exactMatch.title
    }
    
    // Check for partial match (for subpages)
    const partialMatch = menuItems.find(item => pathname.startsWith(item.href))
    if (partialMatch) {
      return partialMatch.title
    }
    
    // Default fallback
    return "Dashboard"
  }

  // Function to generate breadcrumbs
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)

    if (segments.length === 1 && segments[0] === "dashboard") {
      return (
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      )
    }

    return (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    )
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <LoadingGlobal />
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return (
      <LoadingToLogin />
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>{getBreadcrumbs()}</Breadcrumb>

          {/* User Menu di ujung kanan */}
          <div className="ml-auto">
            <UserMenu
              profile={profile}
              onProfileUpdate={updateProfile}
              onProfileCreate={createProfile}
              userEmail={user.email}
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}