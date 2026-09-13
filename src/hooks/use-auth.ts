"use client"

import { useRouter } from "next/navigation"
import { useSession, signOut } from "@/lib/auth-client"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect, useRef, useCallback } from "react"
import { toast } from "sonner"

export function useAuth() {
  const router = useRouter()
  const { data: session, isPending, refetch } = useSession()
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null)
  const syncedUserId = useRef<string | null>(null)

  // Sync session to Supabase client so RLS (auth.uid() = user_id) works flawlessly
  useEffect(() => {
    if (session?.user && syncedUserId.current !== session.user.id) {
      const syncSupabase = async () => {
        try {
          const supabase = createClient()
          const current = await supabase.auth.getUser()
          if (current.data?.user?.id) {
            setSupabaseUserId(current.data.user.id)
            if (current.data.user.id === session.user.id) {
              syncedUserId.current = session.user.id
              return
            }
          }

          const res = await fetch("/api/auth/supabase-token")
          if (!res.ok) return
          const data = await res.json()
          if (data.token_hash) {
            await supabase.auth.verifyOtp({
              token_hash: data.token_hash,
              type: "email",
            })
            const updated = await supabase.auth.getUser()
            if (updated.data?.user?.id) {
              setSupabaseUserId(updated.data.user.id)
            }
            syncedUserId.current = session.user.id
          }
        } catch (e) {
          console.error("Error syncing Supabase session:", e)
        }
      }
      syncSupabase()
    }
  }, [session?.user])

  const user = session?.user
    ? {
        ...session.user,
        id: supabaseUserId || session.user.id,
        betterAuthId: session.user.id,
        supabaseId: supabaseUserId,
        user_metadata: {
          full_name: session.user.name,
          avatar_url: session.user.image,
        },
      }
    : null

  const isAuthenticated = !!session?.user
  const loading = isPending

  const redirectToLogin = () => {
    router.push("/login")
  }

  const redirectToDashboard = () => {
    router.push("/dashboard")
  }

  const logout = async () => {
    try {
      setLogoutLoading(true)
      setLogoutError(null)

      try {
        const supabase = createClient()
        await supabase.auth.signOut()
      } catch {
        // Continue logout
      }

      await signOut({
        fetchOptions: {
          onSuccess: () => {
            syncedUserId.current = null
            if (typeof window !== "undefined") {
              localStorage.removeItem("user-preferences")
              localStorage.removeItem("hasVisitedDashboard")
            }
            toast.message("Logout berhasil!", {
              description: "Anda telah keluar dari akun.",
            })
            redirectToLogin()
          },
          onError: (ctx) => {
            const msg = ctx.error.message || "Terjadi kesalahan saat logout"
            setLogoutError(msg)
            toast.error("Logout gagal", { description: msg })
          },
        },
      })

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

  const clearLogoutError = useCallback(() => {
    setLogoutError(null)
  }, [])

  const checkSession = useCallback(async () => {
    try {
      await refetch()
      return !!session?.user
    } catch {
      return false
    }
  }, [refetch, session?.user])

  return {
    user: user as any,
    loading,
    isAuthenticated,
    redirectToLogin,
    redirectToDashboard,
    logout,
    logoutLoading,
    logoutError,
    clearLogoutError,
    checkSession,
  }
}