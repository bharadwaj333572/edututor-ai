import type { User } from "./types"
import { mockUsers } from "./mock-data"

// Simple session-based authentication
export class AuthService {
  private static readonly SESSION_KEY = "edututor_user"

  static login(email: string, password: string): User | null {
    // Mock authentication - in real app, verify against database
    const user = mockUsers.find((u) => u.email === email)
    if (user && password === "password") {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user))
      }
      return user
    }
    return null
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(this.SESSION_KEY)
    }
  }

  static getCurrentUser(): User | null {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem(this.SESSION_KEY)
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
}
