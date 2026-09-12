"use client"

import { useState, useEffect, useCallback } from "react"
import { ProfileService } from "@/services/profile.service"
import type { Profile, ProfileUpdateInput } from "@/interfaces/profile-interface"

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await ProfileService.getProfile(userId)
      setProfile(data)
    } catch (err) {
      console.error("useProfile: Error fetching profile:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [userId])

  const updateProfile = async (updates: ProfileUpdateInput) => {
    if (!userId) {
      throw new Error("User ID is required")
    }

    try {
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
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
    refetch: fetchProfile,
  }
}
