"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
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
  }, [router])

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
      
      // Redirect to login page
      redirectToLogin()
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat logout"
      setLogoutError(errorMessage)
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
  }
}