import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

const fromFaDigitMap: Record<string, string> = {}
for (let i = 0; i < 10; i++) {
  fromFaDigitMap[faDigits[i]] = String(i) // ۰→0, ۱→1, …
  fromFaDigitMap[String.fromCharCode(0x660 + i)] = String(i) // ٠→0, ١→1, …
}

/** Convert Persian/Arabic-indic digits to English digits. */
export function normalizeDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (d) => fromFaDigitMap[d] ?? d)
}

/** Convert a number/string to Persian digits. */
export function toFa(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "—"
  return String(value).replace(/\d/g, (d) => faDigits[Number(d)])
}

/** Format an integer with thousands separators, then Persian digits.
 *  Returns "—" for null, undefined, or NaN. */
export function faNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—"
  return toFa(value.toLocaleString("en-US"))
}
