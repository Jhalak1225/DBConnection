"use server"
import { redirect } from "next/navigation"
import { createSession, deleteSession, verifySession } from "@/lib/session"
import { verifyPassword, hashPassword } from "@/lib/password"

// Mock user database - replace with your actual database
const users = [
  {
    id: "1",
    email: "demo@example.com",
    password: "$2a$10$rOzJqQnQQjQoQjQoQjQoQu", // hashed "password123"
    name: "Demo User",
  },
]

export interface LoginResult {
  success: boolean
  error?: string
}

export async function login(formData: FormData): Promise<LoginResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate input
  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  // Find user (replace with database query)
  const user = users.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: "Invalid email or password" }
  }

  // Verify password (implement proper password hashing)
  const isValidPassword = await verifyPassword(password, user.password)

  if (!isValidPassword) {
    return { success: false, error: "Invalid email or password" }
  }

  // Create session
  const sessionData = {
    userId: user.id,
    email: user.email,
    name: user.name,
  }

  await createSession(sessionData)

  return { success: true }
}

export async function signup(formData: FormData): Promise<LoginResult> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate input
  if (!name || !email || !password) {
    return { success: false, error: "All fields are required" }
  }

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    return { success: false, error: "An account with this email already exists" }
  }

  // Hash password (in production, use bcrypt)
  const hashedPassword = await hashPassword(password)

  // Create new user (in production, save to database)
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
  }

  users.push(newUser)

  return { success: true }
}

export async function forgotPassword(formData: FormData): Promise<LoginResult> {
  const email = formData.get("email") as string

  if (!email) {
    return { success: false, error: "Email is required" }
  }

  // Check if user exists
  const user = users.find((u) => u.email === email)
  if (!user) {
    // For security, don't reveal if email exists or not
    return { success: true }
  }

  // Generate reset token (in production, save to database with expiration)
  const resetToken = generateResetToken()

  // Store token temporarily (in production, save to database)
  resetTokens.set(resetToken, {
    userId: user.id,
    email: user.email,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  })

  // Send email (mock implementation)
  await sendPasswordResetEmail(email, resetToken)

  return { success: true }
}

export async function resetPassword(formData: FormData): Promise<LoginResult> {
  const token = formData.get("token") as string
  const password = formData.get("password") as string

  if (!token || !password) {
    return { success: false, error: "Token and password are required" }
  }

  // Verify token
  const tokenData = resetTokens.get(token)
  if (!tokenData || tokenData.expiresAt < new Date()) {
    return { success: false, error: "Invalid or expired reset token" }
  }

  // Find user and update password
  const userIndex = users.findIndex((u) => u.id === tokenData.userId)
  if (userIndex === -1) {
    return { success: false, error: "User not found" }
  }

  // Hash new password
  const hashedPassword = await hashPassword(password)
  users[userIndex].password = hashedPassword

  // Remove used token
  resetTokens.delete(token)

  return { success: true }
}

// Helper functions
function generateResetToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  // Mock email sending - in production, use a service like SendGrid, Resend, etc.
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`

  console.log(`Password reset email would be sent to ${email}`)
  console.log(`Reset URL: ${resetUrl}`)

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

// Temporary storage for reset tokens (use database in production)
const resetTokens = new Map<
  string,
  {
    userId: string
    email: string
    expiresAt: Date
  }
>()

export async function logout() {
  await deleteSession()
  redirect("/login")
}

export async function getUser() {
  const session = await verifySession()
  if (!session) return null

  // In a real app, fetch user data from database
  return {
    id: session.userId,
    email: session.email,
    name: session.name,
  }
}
