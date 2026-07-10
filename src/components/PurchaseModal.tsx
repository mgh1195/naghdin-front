import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { confirmPurchaseApi } from "@/services/cart"

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  checkIds: string[]
  onSuccess: () => void
}

export default function PurchaseModal({ isOpen, onClose, checkIds, onSuccess }: PurchaseModalProps) {
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleConfirm = async () => {
    if (!agreed || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await confirmPurchaseApi(checkIds)
      setAgreed(false)
      onClose()
      onSuccess()
    } catch {
      setError("خطا در نهایی‌سازی خرید. لطفاً مجدداً تلاش کنید.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="تایید نهایی خرید"
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-clip rounded-2xl bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="text-sm font-bold text-foreground">قرارداد خرید</span>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="بستن"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="bg-muted p-4">
            <iframe
              src="/sample-local-pdf.pdf"
              className="mx-auto h-[35vh] w-full rounded-lg border-0 sm:h-[40vh]"
              title="قرارداد خرید"
            />
          </div>

          <div className="p-6 space-y-5">
            <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
              <p className="text-xs font-semibold leading-relaxed text-accent-foreground">
                توجه: در صورت نهایی شدن خرید و تکمیل آدرس در پروفایل شخصی قرارداد امضا شده برای شما پست خواهد شد.
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-border bg-card accent-primary"
              />
              <span className="text-sm text-foreground">
                شرایط و قوانین را مطالعه کرده و تایید می‌کنم.
              </span>
            </label>

            {error && (
              <p className="text-center text-xs text-accent">{error}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={!agreed || submitting}
                onClick={handleConfirm}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {submitting ? "در حال ثبت..." : "تایید"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="shrink-0 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:opacity-50"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}