import type { Company } from "./company.types"

/**
 * Guarantor entity returned by the API (nested inside projects, etc.).
 *
 * Known `type` values:
 * - `"LEGAL"` — company/juristic person
 * - `"REAL"`  — natural person
 */
export interface Guarantor {
  id?: string
  company?: Company
  currentCredit?: number
  type?: string
  companyDto?: Company
}
