import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { useAuth } from "./AuthContext"
import {
  getCartApi,
  addToCartApi,
  removeFromCartApi,
  type Cart,
} from "@/services/cart"

import CartDrawer from "@/components/CartDrawer"

interface CartContextValue {
  items: Set<string>
  cart: Cart | null
  loading: boolean
  error: string | null
  isInCart: (id: string) => boolean
  addToCart: (id: string) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  toggleCart: (id: string) => Promise<void>
  count: number
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  fetchCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [itemIds, setItemIds] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCartApi()
      setCart(data)
      setItemIds(new Set(data.items.map((i) => i.check.id)))
    } catch {
      setError("خطا در دریافت سبد خرید")
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setCart(null)
      setItemIds(new Set())
      setError(null)
    }
  }, [isAuthenticated, fetchCart])

  const addToCart = useCallback(
    async (id: string) => {
      try {
        setError(null)
        const data = await addToCartApi(id)
        setCart(data)
        setItemIds(new Set(data.items.map((i) => i.check.id)))
      } catch {
        setError("خطا در افزودن به سبد خرید")
      }
    },
    [],
  )

  const removeFromCart = useCallback(
    async (id: string) => {
      try {
        setError(null)
        const data = await removeFromCartApi(id)
        setCart(data)
        setItemIds(new Set(data.items.map((i) => i.check.id)))
      } catch {
        setError("خطا در حذف از سبد خرید")
      }
    },
    [],
  )

  const toggleCart = useCallback(
    async (id: string) => {
      if (itemIds.has(id)) {
        await removeFromCart(id)
      } else {
        await addToCart(id)
      }
    },
    [itemIds, addToCart, removeFromCart],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items: itemIds,
      cart,
      loading,
      error,
      isInCart: (id: string) => itemIds.has(id),
      addToCart,
      removeFromCart,
      toggleCart,
      count: itemIds.size,
      drawerOpen,
      openDrawer,
      closeDrawer,
      fetchCart,
    }),
    [itemIds, cart, loading, error, addToCart, removeFromCart, toggleCart, drawerOpen, openDrawer, closeDrawer, fetchCart],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}