import { useEffect } from "react"
import { ShieldCheck, X } from "lucide-react"
import LoginFlow from "./LoginFlow"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    const previousOverflow = document.body.style.overflow

    document.addEventListener("keydown", handleEscape)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSuccess = () => {
    onSuccess?.()
    onClose()
  }

  return (
    <div
      className="login-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-foreground/70 p-3 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <section
        className="login-modal-card relative flex max-h-[min(92vh,44rem)] w-full max-w-md flex-col overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-2xl shadow-foreground/20"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 to-transparent" />

        <header className="relative flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <h2 id="login-modal-title" className="text-base font-black text-foreground">
                ورود به حساب کاربری
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                ورود سریع با کد یک‌بارمصرف
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-4 focus:ring-primary/15"
            aria-label="بستن"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <LoginFlow onSuccess={handleSuccess} />
        </div>
      </section>
    </div>
  )
}
