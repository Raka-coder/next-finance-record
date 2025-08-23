import { createClient } from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const _next = searchParams.get('next')
  const next = _next?.startsWith('/') ? _next : '/'

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // Always redirect to update-password after successful verification
      return Response.redirect(new URL('/update-password', request.url))
    } else {
      // redirect the user to an error page with some instructions
      return Response.redirect(new URL(`/error?error=${encodeURIComponent(error.message)}`, request.url))
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/error?error=No token hash or type`)
}
