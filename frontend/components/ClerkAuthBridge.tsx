'use client'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store'

/**
 * Syncs Clerk auth state into the zustand useAuth store so that all
 * existing `user` checks across the app continue to work without changes.
 * Also intercepts openAuth() calls and redirects to the Clerk pages
 * instead of the old custom API modal.
 */
export default function ClerkAuthBridge() {
  const { user: clerkUser, isSignedIn } = useUser()
  const { setUser, authOpen, authMode, closeAuth } = useAuth()
  const router = useRouter()

  // Sync Clerk user → zustand store
  useEffect(() => {
    if (isSignedIn && clerkUser) {
      setUser({
        id: 0,
        full_name: clerkUser.fullName ?? clerkUser.firstName ?? clerkUser.username ?? 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
        phone: null,
        is_active: true,
        is_admin: false,
        created_at: clerkUser.createdAt?.toISOString() ?? '',
      })
    } else {
      setUser(null)
    }
  }, [isSignedIn, clerkUser])

  // Intercept openAuth() → redirect to Clerk pages
  useEffect(() => {
    if (authOpen) {
      closeAuth()
      router.push(authMode === 'register' ? '/sign-up' : '/sign-in')
    }
  }, [authOpen, authMode, closeAuth, router])

  return null
}
