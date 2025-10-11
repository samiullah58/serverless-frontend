"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { confirmSignUp, resendConfirmationCode } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, ArrowLeft } from "lucide-react"

export default function VerifyPage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const usernameParam = searchParams.get("username")
    if (usernameParam) {
      setUsername(usernameParam)
    } else {
      // If no username in URL, redirect to signup
      router.push("/signup")
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) return

    setLoading(true)

    try {
      await confirmSignUp(username, code)
      toast({
        title: "Success",
        description: "Account verified successfully! You can now login.",
      })
      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify account",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!username) return

    setResendLoading(true)

    try {
      await resendConfirmationCode(username)
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      })
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Verify Account
          </CardTitle>
          <CardDescription>
            Enter the verification code sent to your email address
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={loading}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            <div className="text-sm text-muted-foreground text-center">
              <p>We sent a verification code to your email.</p>
              <p>Check your inbox and enter the code above.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading || !code}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Account
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleResendCode}
              disabled={resendLoading}
            >
              {resendLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend Code
            </Button>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              <Link href="/signup" className="text-primary hover:underline">
                Back to Sign Up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
