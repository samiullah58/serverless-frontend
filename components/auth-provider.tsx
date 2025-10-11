"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { type AuthUser, getCurrentUser, signOut as authSignOut } from "@/lib/auth"

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => void
  error: string | null
  setUser: (user: AuthUser | null) => void
  logoutLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: () => {},
  error: null,
  setUser: () => {},
  logoutLoading: false,
})

export const useAuth = () => useContext(AuthContext)

const publicPaths = ["/login", "/signup"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Redirect logic
    if (!loading && !error) {
      const isPublicPath = publicPaths.includes(pathname)

      if (!user && !isPublicPath) {
        router.push("/login")
      } else if (user && isPublicPath) {
        router.push("/items")
      }
    }
  }, [user, loading, pathname, error])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setError(null)
    } catch (err) {
      console.error("[v0] Auth check error:", err)
      setError(err instanceof Error ? err.message : "Authentication error")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLogoutLoading(true)
    try {
      authSignOut()
      setUser(null)
      router.push("/login")
    } finally {
      setLogoutLoading(false)
    }
  }

  if (error && error.includes("Cognito configuration")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-4 rounded-lg border border-destructive bg-destructive/10 p-6">
          <h2 className="text-xl font-semibold text-destructive">Configuration Error</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <div className="space-y-2 rounded-md bg-muted p-4 text-sm">
            <p className="font-medium">Required environment variables:</p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>NEXT_PUBLIC_COGNITO_USER_POOL_ID</li>
              <li>NEXT_PUBLIC_COGNITO_CLIENT_ID</li>
              <li>NEXT_PUBLIC_API_URL</li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              Please add these to your environment variables in the v0 sidebar under "Vars" or in your .env.local file.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut, error, setUser, logoutLoading }}>{children}</AuthContext.Provider>
  )
}
