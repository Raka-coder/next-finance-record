export interface Profile {
  id: string
  username: string
  full_name?: string | null
  avatar_url?: string | null
  email?: string | null
  created_at?: string
  updated_at?: string
}

export interface ProfileUpdateInput {
  username?: string
  full_name?: string | null
  avatar_url?: string | null
}

