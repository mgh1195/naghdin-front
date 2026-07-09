import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

/** Convert a number/string to Persian digits. */
export function toFa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => faDigits[Number(d)])
}

/** Format an integer with thousands separators, then Persian digits. */
export function faNumber(value: number): string {
  return toFa(value.toLocaleString("en-US"))
}
