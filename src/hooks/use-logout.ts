"use client"

import { useState } from "react"
import { supabase } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function useLogout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setError(error.message)
        throw error
      }

      // Clear any local storage or cache if needed
      localStorage.removeItem('user-preferences')
      
      // Redirect to login page
      router.push('/login')
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat logout"
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    logout,
    loading,
    error,
    clearError,
  }
}
