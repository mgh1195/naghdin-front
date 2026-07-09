import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { getToken, setToken as saveToken, clearToken } from "@/services/http"

const PHONE_KEY = "sarmaye_phone"

function getStoredPhone(): string | null {
  return localStorage.getItem(PHONE_KEY)
}

function savePhone(phone: string): void {
  localStorage.setItem(PHONE_KEY, phone)
}

function clearPhone(): void {
  localStorage.removeItem(PHONE_KEY)
}

interface AuthContextValue {
  token: string | null
  phone: string | null
  isAuthenticated: boolean
  login: (token: string, phone: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken())
  const [phone, setPhoneState] = useState<string | null>(() => getStoredPhone())

  const login = useCallback((jwt: string, userPhone: string) => {
    saveToken(jwt)
    savePhone(userPhone)
    setTokenState(jwt)
    setPhoneState(userPhone)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    clearPhone()
    setTokenState(null)
    setPhoneState(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, phone, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}