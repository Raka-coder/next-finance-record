"use client"

import { useState, useEffect } from "react"
import { ProfileService } from "@/services/profile.service"
import type { Profile } from "@/interfaces/profile-interface"

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      console.log("useProfile: Fetching profile for userId:", userId)

      const data = await ProfileService.getProfile(userId)
      console.log("useProfile: Profile data received:", data)

      setProfile(data)
    } catch (err) {
      console.error("useProfile: Error fetching profile:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      // Jangan set profile ke null jika ada error, biarkan state sebelumnya
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!userId) {
      throw new Error("User ID is required")
    }

    try {
      console.log("useProfile: Updating profile:", updates)
      const updatedProfile = await ProfileService.updateProfile(userId, updates)
      if (updatedProfile) {
        setProfile(updatedProfile)
      }
      return updatedProfile
    } catch (err) {
      console.error("useProfile: Error updating profile:", err)
      setError(err instanceof Error ? err.message : "Failed to update profile")
      throw err
    }
  }

  const createProfile = async (username: string, fullName?: string) => {
    if (!userId) {
      throw new Error("User ID is required")
    }

    try {
      console.log("useProfile: Creating profile:", { username, fullName })
      const newProfile = await ProfileService.createProfile(userId, username, fullName)
      if (newProfile) {
        setProfile(newProfile)
      }
      return newProfile
    } catch (err) {
      console.error("useProfile: Error creating profile:", err)
      setError(err instanceof Error ? err.message : "Failed to create profile")
      throw err
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [userId])

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
    refetch: fetchProfile,
  }
}
