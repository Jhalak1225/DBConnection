"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { forgotPassword } from "@/app/actions/auth"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("email", email)

      const result = await forgotPassword(formData)

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || "Failed to send reset email. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
        <p className="text-gray-600">
          {"We've sent a password reset link to "}
          <span className="font-medium">{email}</span>
        </p>
        <p className="text-sm text-gray-500">
          {"Didn't receive the email? Check your spam folder or "}
          <button onClick={() => setSuccess(false)} className="text-primary hover:text-primary/80 font-medium">
            try again
          </button>
        </p>
        <div className="pt-4">
          <a href="/login" className="inline-flex items-center text-sm text-primary hover:text-primary/80">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError(null)
          }}
          placeholder="Enter your email address"
          required
          disabled={isLoading}
          className="w-full"
        />
      </div>

      <Button type="submit" className="w-full" disabled={!email || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending reset link...
          </>
        ) : (
          "Send Reset Link"
        )}
      </Button>

      <div className="text-center">
        <a href="/login" className="inline-flex items-center text-sm text-primary hover:text-primary/80">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to login
        </a>
      </div>
    </form>
  )
}
