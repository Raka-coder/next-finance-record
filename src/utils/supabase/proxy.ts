import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Log any auth errors for debugging
  if (error) {
    console.error('Auth error in middleware:', error)
  }

  // Define public path patterns
  const pathname = request.nextUrl.pathname
  const publicExactPaths = ['/', '/login', '/register', '/forgot-password', '/update-password', '/confirm']
  const isPublicPath = 
    publicExactPaths.includes(pathname) || 
    pathname.startsWith('/api/') || 
    pathname.startsWith('/confirm')

  // If user is not authenticated and trying to access protected routes, redirect to login
  if ((!user || error) && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(pathname)
  if (user && !error && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}