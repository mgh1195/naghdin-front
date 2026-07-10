import type { Check } from "@/data/opportunities"
import { checks as allChecks } from "@/data/opportunities"
import { apiFetch } from "./http"

export interface CartItem {
  check: Check
  addedAt: string
}

export interface Cart {
  items: CartItem[]
  totalCount: number
  totalDiscountedAmount: number
  totalChequeAmountRial: number
  totalProfit: number
  weightedAverageDays: number
  principalReturnDate: string | null
  earliestDueDate: string | null
  latestDueDate: string | null
}

// TODO: Replace with real API endpoint — POST /cart/add
export async function addToCartApi(checkId: string): Promise<Cart> {
  // TODO: Call actual API — example:
  // const res = await apiFetch("/api/cart/add", {
  //   method: "POST",
  //   body: JSON.stringify({ checkId }),
  // })
  // if (!res.ok) throw new Error("خطا در افزودن به سبد خرید")
  // return res.json()

  await new Promise((resolve) => setTimeout(resolve, 600))
  return getMockCart([checkId, ...(getMockCartIds())])
}

// TODO: Replace with real API endpoint — DELETE /cart/remove
export async function removeFromCartApi(checkId: string): Promise<Cart> {
  // TODO: Call actual API — example:
  // const res = await apiFetch(`/api/cart/remove/${checkId}`, {
  //   method: "DELETE",
  // })
  // if (!res.ok) throw new Error("خطا در حذف از سبد خرید")
  // return res.json()

  await new Promise((resolve) => setTimeout(resolve, 400))
  const ids = getMockCartIds().filter((id) => id !== checkId)
  return getMockCart(ids)
}

// TODO: Replace with real API endpoint — GET /cart
export async function getCartApi(): Promise<Cart> {
  // TODO: Call actual API — example:
  // const res = await apiFetch("/api/cart")
  // if (!res.ok) throw new Error("خطا در دریافت سبد خرید")
  // return res.json()

  await new Promise((resolve) => setTimeout(resolve, 500))
  return getMockCart(getMockCartIds())
}

// --- Mock helpers ---

const MOCK_CART_KEY = "sarmaye_mock_cart"

function getMockCartIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(MOCK_CART_KEY) || "[]") as string[]
  } catch {
    return []
  }
}

function saveMockCartIds(ids: string[]): void {
  localStorage.setItem(MOCK_CART_KEY, JSON.stringify(ids))
}

function getMockCart(ids: string[]): Cart {
  saveMockCartIds(ids)
  const items: CartItem[] = ids
    .map((id) => {
      const check = allChecks.find((c) => c.id === id)
      return check ? { check, addedAt: new Date().toISOString() } : null
    })
    .filter(Boolean) as CartItem[]

  const dates = items.map((i) => i.check.date).filter(Boolean)
  // TODO: All summary fields should come from the real API response
  return {
    items,
    totalCount: items.length,
    totalDiscountedAmount: items.reduce((sum, i) => sum + i.check.discountedAmount, 0),
    totalChequeAmountRial: items.reduce((sum, i) => sum + i.check.chequeAmountRial, 0),
    totalProfit: items.reduce((sum, i) => sum + i.check.profit, 0),
    weightedAverageDays: items.length > 0 ? 60 : 0,
    principalReturnDate: dates.length > 0 ? dates.sort()[dates.length - 1] : null,
    earliestDueDate: dates.length > 0 ? dates.sort()[0] : null,
    latestDueDate: dates.length > 0 ? dates.sort()[dates.length - 1] : null,
  }
}

// TODO: Replace with real API endpoint — POST /purchase/confirm
export async function confirmPurchaseApi(checkIds: string[]): Promise<void> {
  // TODO: Call actual API — example:
  // const res = await apiFetch("/api/purchase/confirm", {
  //   method: "POST",
  //   body: JSON.stringify({ checkIds }),
  // })
  // if (!res.ok) throw new Error("خطا در نهایی‌سازی خرید")

  await new Promise((resolve) => setTimeout(resolve, 1500))
}