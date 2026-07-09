import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import LoginModal from "@/components/LoginModal"
import { useAuth } from "./AuthContext"

interface AuthModalContextValue {
  authenticate: (action: () => void) => void
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const authenticate = useCallback(
    (action: () => void) => {
      if (isAuthenticated) {
        action()
      } else {
        setPendingAction(() => action)
        setModalOpen(true)
      }
    },
    [isAuthenticated],
  )

  const handleSuccess = useCallback(() => {
    setModalOpen(false)
    pendingAction?.()
    setPendingAction(null)
  }, [pendingAction])

  const handleClose = useCallback(() => {
    setModalOpen(false)
    setPendingAction(null)
  }, [])

  return (
    <AuthModalContext.Provider value={{ authenticate }}>
      {children}
      <LoginModal isOpen={modalOpen} onClose={handleClose} onSuccess={handleSuccess} />
    </AuthModalContext.Provider>
  )
}

export function useAuthGuard() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error("useAuthGuard must be used within AuthModalProvider")
  return ctx
}