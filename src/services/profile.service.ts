import { createClient } from "@/utils/supabase/client"
import type { Profile, ProfileUpdateInput } from "@/interfaces/profile-interface"

const isUUID = (str?: string): boolean =>
  !!str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)

export class ProfileService {
  private static getClient() {
    return createClient()
  }

  private static async resolveUUID(userId?: string): Promise<string | null> {
    if (isUUID(userId)) return userId!
    try {
      const supabase = this.getClient()
      const { data } = await supabase.auth.getUser()
      if (data?.user?.id && isUUID(data.user.id)) {
        return data.user.id
      }
    } catch {
      // Ignored
    }
    return null
  }

  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const resolvedId = await this.resolveUUID(userId)
      if (!resolvedId) {
        return null
      }

      const supabase = this.getClient()
      const { data, error } = await supabase.from("profiles").select("*").eq("id", resolvedId).single()

      if (error) {
        if (error.code === "PGRST116") {
          return null
        }
        console.error("Supabase error fetching profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error fetching profile:", error)
      return null
    }
  }

  static async createProfile(userId: string, username: string, fullName?: string): Promise<Profile | null> {
    try {
      const resolvedId = await this.resolveUUID(userId)
      if (!resolvedId) {
        throw new Error("Invalid UUID for profile creation")
      }

      const supabase = this.getClient()
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: resolvedId,
          username: username,
          full_name: fullName || "",
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating profile:", error)
        throw new Error(`Failed to create profile: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error("Error creating profile:", error)
      return null
    }
  }

  static async updateProfile(userId: string, updates: ProfileUpdateInput): Promise<Profile | null> {
    try {
      const resolvedId = await this.resolveUUID(userId)
      if (!resolvedId) {
        throw new Error("Invalid UUID for profile update")
      }

      const supabase = this.getClient()
      const { data, error } = await supabase.from("profiles").update(updates).eq("id", resolvedId).select().single()

      if (error) {
        console.error("Error updating profile:", error)
        throw new Error(`Failed to update profile: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  static async checkUsernameAvailability(username: string, excludeUserId?: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      let query = supabase.from("profiles").select("username").eq("username", username)

      const resolvedExcludeId = await this.resolveUUID(excludeUserId)
      if (resolvedExcludeId) {
        query = query.neq("id", resolvedExcludeId)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error checking username:", error)
        return false
      }

      return (data || []).length === 0
    } catch (error) {
      console.error("Error checking username availability:", error)
      return false
    }
  }
}

