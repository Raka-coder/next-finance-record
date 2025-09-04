"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"
import { toast } from "sonner"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const router = useRouter()

  // Function to check session validity
  const checkSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error("Session check error:", error)
        // If there's an error checking session, treat as unauthenticated
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
        return false
      }
      
      if (!session) {
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
        return false
      }
      
      // Validate session by trying to get user
      const { data: { user: validatedUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !validatedUser) {
        console.error("User validation error:", userError)
        // Session is invalid, clear state and redirect
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
        
        // Show error toast only if we were previously authenticated
        if (isAuthenticated) {
          console.log("Session expired")
        }
        
        // Redirect to login if on a protected page
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && 
            !window.location.pathname.startsWith('/register') && 
            !window.location.pathname.startsWith('/forgot-password') &&
            !window.location.pathname.startsWith('/update-password') &&
            !window.location.pathname.startsWith('/confirm')) {
          router.push("/login")
        }
        
        return false
      }
      
      setUser(validatedUser)
      setIsAuthenticated(true)
      setLoading(false)
      return true
    } catch (err) {
      console.error("Unexpected error during session check:", err)
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
      return false
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    // Get initial session
    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
        // Redirect to login if on a protected page
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && 
            !window.location.pathname.startsWith('/register') && 
            !window.location.pathname.startsWith('/forgot-password') &&
            !window.location.pathname.startsWith('/update-password') &&
            !window.location.pathname.startsWith('/confirm')) {
          router.push("/login")
        }
        return
      }
      setUser(session.user)
      setIsAuthenticated(true)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [checkSession, router])

  // Periodically check session validity (every 5 minutes)
  useEffect(() => {
    if (!isAuthenticated) return
    
    const interval = setInterval(() => {
      checkSession()
    }, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [isAuthenticated, checkSession])

  const redirectToLogin = () => {
    // Clear user state immediately
    setUser(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  const redirectToDashboard = () => {
    router.push("/dashboard")
  }

  const logout = async () => {
    try {
      setLogoutLoading(true)
      setLogoutError(null)

      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setLogoutError(error.message)
        throw error
      }

      // Clear any local storage or cache if needed
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user-preferences')
        localStorage.removeItem('hasVisitedDashboard')
      }
      
      // Clear user state
      setUser(null)
      setIsAuthenticated(false)
      
      // Show success toast
      toast.message("Logout berhasil!", {
        description: "Anda telah keluar dari akun.",
      })
      
      // Redirect to login page
      redirectToLogin()
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat logout"
      setLogoutError(errorMessage)
      toast.error("Logout gagal", {
        description: errorMessage,
      })
      throw new Error(errorMessage)
    } finally {
      setLogoutLoading(false)
    }
  }

  const clearLogoutError = () => {
    setLogoutError(null)
  }

  return {
    user,
    loading,
    isAuthenticated,
    redirectToLogin,
    redirectToDashboard,
    logout,
    logoutLoading,
    logoutError,
    clearLogoutError,
    checkSession, // Expose checkSession for manual checks if needed
  }
}