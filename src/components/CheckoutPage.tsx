import { useState } from "react"
import { Trash2 } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { faNumber, toFa } from "@/lib/utils"
import PurchaseModal from "./PurchaseModal"

export default function CheckoutPage() {
  const { cart, loading, removeFromCart, fetchCart } = useCart()
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handlePurchaseSuccess = () => {
    setSuccessMessage("خرید با موفقیت نهایی شد.")
    fetchCart()
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <h1 className="text-3xl font-bold text-foreground md:text-4xl">
        نهایی‌سازی خرید
      </h1>

      {successMessage && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
          <p className="text-sm font-semibold text-primary">{successMessage}</p>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="flex flex-col md:flex-row">
          {/* Right side (2/3) — first in DOM */}
          <div className="p-6 md:w-2/3 md:shrink-0 md:p-8">
            {loading ? (
              <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
            ) : cart && cart.items.length > 0 ? (
              <div className="flex flex-col gap-4">
                {cart.items.map((item) => (
                  <div
                    key={item.check.id}
                    className="overflow-hidden rounded-2xl border border-border bg-card"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative aspect-[170/85] w-full md:w-[55%] md:shrink-0">
                        <img
                          src={item.check.image || "/placeholder.svg"}
                          alt={item.check.title}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center p-4 md:flex-1">
                        <h3 className="text-sm font-bold text-foreground">
                          {item.check.title}
                        </h3>
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">سبد خرید خالی است</p>
            )}
          </div>

          {/* Left side (1/3) — second in DOM */}
          <div className="flex flex-col border-t border-border p-6 md:border-r md:border-t-0 md:w-1/3 md:shrink-0 md:p-8">
            {cart && cart.items.length > 0 ? (
              <>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">تعداد چک‌ها</span>
                    <span className="text-sm font-semibold text-foreground">
                      {toFa(cart.totalCount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">مجموع مبلغ چک‌ها</span>
                    <span className="font-num text-sm font-semibold text-foreground">
                      {faNumber(cart.totalChequeAmountRial)} ریال
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">سود کلی سرمایه‌گذاری</span>
                    <span className="font-num text-sm font-semibold text-primary">
                      {toFa(cart.totalProfit)}٪
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">تاریخ بازگشت اصل پول</span>
                    <span className="text-sm font-semibold text-foreground">
                      {cart.principalReturnDate || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-muted-foreground">میانگین وزنی زمان چک‌ها</span>
                    <span className="font-num text-sm font-semibold text-foreground">
                      {toFa(cart.weightedAverageDays)} روز
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPurchaseModal(true)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  خرید
                </button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">خلاصه خرید</p>
            )}
          </div>
        </div>
      </div>

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        checkIds={cart?.items.map((i) => i.check.id) ?? []}
        onSuccess={handlePurchaseSuccess}
      />
    </main>
  )
}