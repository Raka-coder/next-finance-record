import { supabase } from "@/utils/supabase/client"
import type { Profile } from "@/interfaces/profile-interface"

export class ProfileService {
  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      console.log("Fetching profile for user:", userId)

      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Supabase error:", error)

        // Jika profile tidak ditemukan, bukan error fatal
        if (error.code === "PGRST116") {
          console.log("Profile not found, this is normal for new users")
          return null
        }

        throw new Error(`Supabase error: ${error.message}`)
      }

      console.log("Profile fetched successfully:", data)
      return data
    } catch (error) {
      console.error("Error fetching profile:", error)

      // Jangan throw error, return null agar app tidak crash
      return null
    }
  }

  static async createProfile(userId: string, username: string, fullName?: string): Promise<Profile | null> {
    try {
      console.log("Creating profile for user:", userId)

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

      console.log("Profile created successfully:", data)
      return data
    } catch (error) {
      console.error("Error creating profile:", error)
      return null
    }
  }

  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    try {
      console.log("Updating profile for user:", userId, updates)

      const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

      if (error) {
        console.error("Error updating profile:", error)
        throw new Error(`Failed to update profile: ${error.message}`)
      }

      console.log("Profile updated successfully:", data)
      return data
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  static async checkUsernameAvailability(username: string, excludeUserId?: string): Promise<boolean> {
    try {
      let query = supabase.from("profiles").select("username").eq("username", username)

      if (excludeUserId) {
        query = query.neq("id", excludeUserId)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error checking username:", error)
        return false
      }

      return data.length === 0
    } catch (error) {
      console.error("Error checking username availability:", error)
      return false
    }
  }
}
