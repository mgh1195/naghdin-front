import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

export default function FloatingCartButton() {
  const { count, loading, openDrawer } = useCart()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated || count === 0) return null

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label={`سبد خرید (${count})`}
      className="fixed left-5 top-1/2 z-40 -translate-y-1/2 rounded-full bg-primary p-3.5 text-primary-foreground shadow transition-opacity hover:opacity-90"
    >
      <ShoppingCart className="size-5" />
      {loading ? (
        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
          …
        </span>
      ) : (
        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
          {count}
        </span>
      )}
    </button>
  )
}