"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import LoadingGlobal from "@/components/loading/loading-global"
import LoadingToDashboard from "@/components/loading/loading-to-dashboard"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user, loading, isAuthenticated, redirectToDashboard } = useAuth()
  const toastShown = useRef(false)

  useEffect(() => {
    if (isAuthenticated && user) {
      const currentPath = window.location.pathname
      if (currentPath.startsWith('/confirm') || currentPath.startsWith('/update-password')) {
        return
      }

      const hasVisited = localStorage.getItem("hasVisitedDashboard")
      if (!hasVisited && !toastShown.current) {
        localStorage.setItem("hasVisitedDashboard", "true")
        toastShown.current = true
        toast.message("Login Berhasil!", {
          description: "Selamat Datang!",
        })
      } else if (!toastShown.current) {
        toastShown.current = true
      }

      redirectToDashboard()
    }

    const handleBeforeUnload = () => {
      if (!isAuthenticated) {
        localStorage.removeItem("hasVisitedDashboard")
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      toastShown.current = false
    }
  }, [isAuthenticated, user, redirectToDashboard])

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const isConfirmOrUpdate = currentPath.startsWith('/confirm') || currentPath.startsWith('/update-password')

  if (loading) {
    return <LoadingGlobal />
  }

  if (isAuthenticated && user && !isConfirmOrUpdate) {
    return <LoadingToDashboard />
  }

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between bg-background text-foreground selection:bg-foreground selection:text-background">
      {/* Editorial Top Utility Bar with clean 1px border */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xs">
        <div className="flex h-13 items-center justify-between px-6 max-w-5xl w-full mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-foreground hover:opacity-75 transition-opacity"
          >
            <div className="size-6 rounded-[3px] bg-primary text-primary-foreground flex items-center justify-center font-mono text-[11px] font-bold">
              FR
            </div>
            <span className="font-medium text-xs tracking-tight text-foreground">
              FinanceRecord
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area with generous macro-whitespace */}
      <main className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
        {children}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-border py-4 px-6 text-center text-[11px] font-mono text-muted-foreground">
        FinanceRecord &middot; Minimalist Financial Ledger
      </footer>
    </div>
  )
}