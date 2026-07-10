import type { User } from "./user.types"
import type { Company } from "./company.types"

/**
 * Known `type` values observed so far:
 * - `"REAL"`
 */
export interface Person {
  id?: string
  type?: string
  company?: Company
  logoKey?: string
  activeTab?: string
  memberSince?: string
  memberUntil?: string
  userDto?: User
}
