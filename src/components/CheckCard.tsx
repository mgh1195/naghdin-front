import { useState } from "react"
import { ShoppingCart, ImageIcon, ShieldCheck, X, Trash2, Check as CheckIcon } from "lucide-react"
import type { Check } from "@/data/opportunities"
import { faNumber, toFa } from "@/lib/utils"
import { useCart } from "@/context/CartContext"
import { useAuthGuard } from "@/context/AuthModalContext"

export default function CheckCard({ item }: { item: Check }) {
  const [modalOpen, setModalOpen] = useState(false)
  const { isInCart, toggleCart } = useCart()
  const { authenticate } = useAuthGuard()
  const inCart = isInCart(item.id)

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-md">
      {/* تصویر چک - نسبت ۱۷۰×۸۵ میلی‌متر (۲:۱) */}
      <div className="relative aspect-[170/85] w-full bg-muted">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          className="size-full object-cover"
        />
      </div>

      {/* دکمه‌های زیر تصویر چک */}
      <div className="grid grid-cols-2 gap-3 border-b border-border/70 p-4">
        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2.5 text-xs font-semibold text-muted-foreground/70"
        >
          <ShieldCheck className="size-4" />
          استعلام صیادی
        </button>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ImageIcon className="size-4" />
          تصویر چک
        </button>
      </div>

      {/* اطلاعات چک */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-base font-bold leading-snug text-foreground text-balance">
          {item.title}
        </h3>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <span className="text-xs text-muted-foreground">مبلغ پس از تنزل</span>
            <span className="font-num text-sm font-semibold text-foreground">
              {faNumber(item.discountedAmount)} تومان
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <span className="text-xs text-muted-foreground">سود سرمایه‌گذاری</span>
            <span className="font-num text-sm font-semibold text-primary">
              {toFa(item.profit)}٪
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">ضامن</span>
            <span className="text-sm font-medium leading-relaxed text-foreground">
              {item.guarantor}
            </span>
          </div>
        </div>

        {/* دکمه افزودن به سبد خرید */}
        <button
          type="button"
          onClick={() => authenticate(() => toggleCart(item.id))}
          className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
            inCart
              ? "bg-accent text-accent-foreground"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {inCart ? (
            <>
              <CheckIcon className="size-4" />
              افزوده شد به سبد خرید
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" />
              افزودن به سبد خرید
            </>
          )}
        </button>
      </div>

      {/* مدال تصویر واقعی چک */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 backdrop-blur-sm p-4"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`تصویر ${item.title}`}
        >
          <div
            className="relative w-full max-w-3xl overflow-clip rounded-2xl bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="text-sm font-bold text-foreground">تصویر چک</span>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="بستن"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="bg-muted p-4">
              <img
                src={item.fullImage || "/placeholder.svg"}
                alt={item.title}
                className="mx-auto w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
