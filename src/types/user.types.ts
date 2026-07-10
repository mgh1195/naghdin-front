/**
 * Known `verificationState` values observed so far:
 * - `"PENDING_NATIONAL_CODE"`
 *
 * More values may be added by the backend — treat as an opaque string.
 */
export interface User {
  id?: string
  phone?: string
  birthDate?: string
  nationalCode?: string
  firstName?: string
  lastName?: string
  verificationState?: string
}
