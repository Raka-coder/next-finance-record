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
    // Check if user is already authenticated
    if (isAuthenticated && user) {
      // Get current path
      const currentPath = window.location.pathname
      
      // Skip redirect for confirm and update-password routes
      if (currentPath.startsWith('/confirm') || currentPath.startsWith('/update-password')) {
        return
      }
      
      // Cek apakah ini kunjungan pertama setelah login
      const hasVisited = localStorage.getItem("hasVisitedDashboard")
      
      if (!hasVisited && !toastShown.current) {
        // Ini adalah kunjungan pertama setelah login
        localStorage.setItem("hasVisitedDashboard", "true")
        toastShown.current = true
        toast.message("Login Berhasil!", {
          description: "Selamat Datang!",
        })
      } else if (!toastShown.current) {
        // Ini adalah kunjungan kembali (misalnya setelah refresh)
        toastShown.current = true
        // toast.message("Login Berhasil!", {
        //   description: "Selamat Datang Kembali!",
        // })
      }
      
      redirectToDashboard()
    }
    
    // Bersihkan flag saat user logout
    const handleBeforeUnload = () => {
      if (!isAuthenticated) {
        localStorage.removeItem("hasVisitedDashboard")
      }
    }
    
    window.addEventListener("beforeunload", handleBeforeUnload)
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      // Reset toastShown saat komponen di-unmount
      toastShown.current = false
    }
  }, [isAuthenticated, user, redirectToDashboard])

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const isConfirmOrUpdate = currentPath.startsWith('/confirm') || currentPath.startsWith('/update-password')

  if (loading) {
    return <LoadingGlobal />
  }

  // Don't render loading for confirm and update-password routes
  if (isAuthenticated && user && !isConfirmOrUpdate) {
    return <LoadingToDashboard />
  }

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 flex items-center justify-between p-4 md:px-8 max-w-6xl w-full mx-auto">
        <Link href="/" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <span className="font-bold text-sm">FR</span>
          </div>
          <span className="font-semibold tracking-tight text-foreground">Finance<span className="text-emerald-500">Record</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Form Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} FinanceRecord. Hak cipta dilindungi.
      </footer>
    </div>
  )
}