// Simple password verification - in production, use bcrypt or similar
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // For demo purposes, check against our simple hash
  if (hashedPassword.startsWith("hashed_")) {
    return password === hashedPassword.replace("hashed_", "")
  }

  // For the existing demo user
  return password === "password123"
}

export async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt or similar
  // const bcrypt = require('bcrypt')
  // return await bcrypt.hash(password, 10)

  // For demo purposes, just prefix with "hashed_"
  return `hashed_${password}`
}
