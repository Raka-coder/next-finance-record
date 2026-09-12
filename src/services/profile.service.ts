import { createClient } from "@/utils/supabase/client"
import type { Profile, ProfileUpdateInput } from "@/interfaces/profile-interface"

export class ProfileService {
  private static getClient() {
    return createClient()
  }

  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

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
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
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
      const supabase = this.getClient()
      const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

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

      if (excludeUserId) {
        query = query.neq("id", excludeUserId)
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

