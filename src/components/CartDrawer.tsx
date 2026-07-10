import { X, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useCart } from "@/context/CartContext"
import { faNumber, toFa } from "@/lib/utils"

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, cart, loading, removeFromCart } = useCart()
  const navigate = useNavigate()

  if (!drawerOpen) return null

  const hasItems = cart && cart.items.length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex bg-foreground/70 backdrop-blur-sm"
      onClick={closeDrawer}
      role="dialog"
      aria-modal="true"
      aria-label="سبد خرید"
    >
      <div
        className="mr-auto flex h-full w-full max-w-md flex-col bg-card shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <span className="text-sm font-bold text-foreground">سبد خرید</span>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="بستن"
          >
            <X className="size-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
          </div>
        ) : hasItems ? (
          <>
            <ul className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {cart.items.map((item) => (
                <li
                  key={item.check.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card shrink-0"
                >
                  <div className="relative aspect-[170/85] w-full bg-muted">
                    <img
                      src={item.check.image || "/placeholder.svg"}
                      alt={item.check.title}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm font-bold text-foreground">
                      {item.check.title}
                    </h4>
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">مبلغ چک (ریال)</span>
                        <span className="font-num text-xs font-semibold text-foreground">
                          {faNumber(item.check.chequeAmountRial)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">مبلغ پس از تنزل</span>
                        <span className="font-num text-xs font-semibold text-foreground">
                          {faNumber(item.check.discountedAmount)} تومان
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">تاریخ سررسید</span>
                        <span className="font-num text-xs font-semibold text-foreground">
                          {item.check.date}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.check.id)}
                      className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent/10 px-3 py-2 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
                    >
                      <Trash2 className="size-3.5" />
                      حذف
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <CartSummary cart={cart} onCheckout={() => { closeDrawer(); navigate("/checkout") }} />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <p className="text-sm text-muted-foreground">سبد خرید شما خالی است</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CartSummary({
  cart,
  onCheckout,
}: {
  cart: NonNullable<ReturnType<typeof useCart>["cart"]>
  onCheckout: () => void
}) {
  return (
    <div className="shrink-0 border-t border-border bg-muted/40 px-6 py-4">
      <div className="flex items-center justify-between py-1.5">
        <span className="text-xs text-muted-foreground">مجموع مبلغ قابل پرداخت</span>
        <span className="font-num text-sm font-bold text-foreground">
          {faNumber(cart.totalDiscountedAmount)} تومان
        </span>
      </div>
      <div className="flex items-center justify-between py-1.5">
        <span className="text-xs text-muted-foreground">اولین سررسید چک</span>
        <span className="text-sm font-semibold text-foreground">
          {cart.earliestDueDate || "—"}
        </span>
      </div>
      <div className="flex items-center justify-between py-1.5">
        <span className="text-xs text-muted-foreground">آخرین سررسید چک</span>
        <span className="text-sm font-semibold text-foreground">
          {cart.latestDueDate || "—"}
        </span>
      </div>
      <div className="flex items-center justify-between py-1.5">
        <span className="text-xs text-muted-foreground">میانگین سود سرمایه‌گذاری</span>
        <span className="font-num text-sm font-semibold text-primary">
          {toFa(cart.totalCount > 0 ? cart.totalProfit / cart.totalCount : 0)}٪
        </span>
      </div>
      <button
        type="button"
        onClick={onCheckout}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        نهایی‌سازی خرید
      </button>
    </div>
  )
}