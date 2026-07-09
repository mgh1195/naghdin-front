import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

interface CartContextValue {
  items: Set<string>
  isInCart: (id: string) => boolean
  addToCart: (id: string) => void
  removeFromCart: (id: string) => void
  toggleCart: (id: string) => void
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

// به‌صورت پیش‌فرض یک مورد در سبد خرید قرار دارد تا هر دو حالت «خرید» و «حذف»
// در جدول چک‌ها قابل مشاهده باشد.
const DEFAULT_CART = ["check-parsian-1"]

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Set<string>>(new Set(DEFAULT_CART))

  const value = useMemo<CartContextValue>(() => {
    const addToCart = (id: string) =>
      setItems((prev) => new Set(prev).add(id))

    const removeFromCart = (id: string) =>
      setItems((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })

    const toggleCart = (id: string) =>
      setItems((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })

    return {
      items,
      isInCart: (id: string) => items.has(id),
      addToCart,
      removeFromCart,
      toggleCart,
      count: items.size,
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
