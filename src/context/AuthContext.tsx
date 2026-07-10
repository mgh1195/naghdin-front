import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { getToken, setToken as saveToken, clearToken } from "@/services/http"
import type { CurrentUser } from "@/types/auth.types"
import { logout as apiLogout } from "@/api/endpoints/auth.api"

const PHONE_KEY = "sarmaye_phone"
const CURRENT_USER_KEY = "sarmaye_current_user"

function getStoredPhone(): string | null {
  return localStorage.getItem(PHONE_KEY)
}

function savePhone(phone: string): void {
  localStorage.setItem(PHONE_KEY, phone)
}

function clearPhone(): void {
  localStorage.removeItem(PHONE_KEY)
}

function getStoredCurrentUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? (JSON.parse(raw) as CurrentUser) : null
  } catch {
    return null
  }
}

function saveCurrentUser(user: CurrentUser): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

interface AuthContextValue {
  token: string | null
  phone: string | null
  currentUser: CurrentUser | null
  isAuthenticated: boolean
  login: (token: string, phone: string, currentUser?: CurrentUser) => void
  logout: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [phone, setPhoneState] = useState<string | null>(() => getStoredPhone())
  const [currentUser, setCurrentUserState] = useState<CurrentUser | null>(() =>
    getStoredCurrentUser(),
  )

  const login = useCallback(
    (jwt: string, userPhone: string, user?: CurrentUser) => {
      saveToken(jwt)
      savePhone(userPhone)
      if (user) saveCurrentUser(user)
      setTokenState(jwt)
      setPhoneState(userPhone)
      if (user) setCurrentUserState(user)
    },
    [],
  )

  const logout = useCallback(async (): Promise<boolean> => {
    const ok = await apiLogout()
    if (!ok) return false
    clearToken()
    clearPhone()
    clearCurrentUser()
    setTokenState(null)
    setPhoneState(null)
    setCurrentUserState(null)
    return true
  }, [])

  return (
    <AuthContext.Provider
      value={{ token, phone, currentUser, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}