"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
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
import { supabase } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const { profile, updateProfile, createProfile } = useProfile(user?.id)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setIsAuthenticated(false)
        setLoading(false)
        router.push("/register")
        return
      }
      setUser(session.user)
      setIsAuthenticated(true)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAuthenticated(false)
        setUser(null)
        router.push("/register")
        return
      }
      setUser(session.user)
      setIsAuthenticated(true)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  // Function to get page title based on pathname
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Ringkasan Keuangan"
      case "/dashboard/tambah-transaksi":
        return "Tambah Transaksi"
      case "/dashboard/daftar-transaksi":
        return "Daftar Transaksi"
      case "/dashboard/pengaturan":
        return "Pengaturan"
      default:
        return "Dashboard"
    }
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
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
