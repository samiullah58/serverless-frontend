"use client"

import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { LogOut, Package, Loader2 } from "lucide-react"

export function Navbar() {
  const { user, signOut, logoutLoading } = useAuth()

  if (!user) return null

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/items" className="flex items-center gap-2 font-semibold text-lg">
            <Package className="h-6 w-6" />
            Items CRUD
          </Link>
          <Link
            href="/items"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Items
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={signOut} disabled={logoutLoading}>
            {logoutLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            {logoutLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </nav>
  )
}
