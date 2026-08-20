import type { Check } from "@/data/opportunities"
import { checks as allChecks } from "@/data/opportunities"

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

// TODO: Replace with real API endpoints — currently backed by localStorage mocks.

export async function addToCartApi(checkId: string): Promise<Cart> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return getMockCart([checkId, ...(getMockCartIds())])
}

export async function removeFromCartApi(checkId: string): Promise<Cart> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const ids = getMockCartIds().filter((id) => id !== checkId)
  return getMockCart(ids)
}

export async function getCartApi(): Promise<Cart> {
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
  // TODO: Summary fields should come from the real API response.
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
export async function confirmPurchaseApi(_checkIds: string[]): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500))
}