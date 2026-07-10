import client from "../client"
import type { LoginResponse } from "@/types/auth.types"

// =============================================================================
//  Endpoints
// =============================================================================

// POST /api/auth/v1/verification-code -------------------------------------------
/**
 * Send a verification code (OTP) to the given phone number.
 *
 * Returns `true` when the server responds with 204 No Content.
 * Returns `false` for any other status — the caller should NOT advance
 * to the OTP screen.
 */
export async function sendVerificationCode(phone: string): Promise<boolean> {
  try {
    await client.post("/api/auth/v1/verification-code", { id: phone })
    return true
  } catch {
    return false
  }
}

// POST /api/auth/v1/login -------------------------------------------------------
/**
 * Verify the OTP code and log the user in.
 *
 * On success (200) returns the JWT token and current-user profile.
 * On failure (non-200) the axios client throws — the caller should handle
 * it via try/catch.
 */
export async function verifyOtp(
  phone: string,
  code: string,
): Promise<LoginResponse> {
  const { data } = await client.post<LoginResponse>("/api/auth/v1/login", {
    id: phone,
    code,
  })
  return data
}

// POST /api/auth/v1/logout ------------------------------------------------------
/**
 * Log the current user out on the server.
 *
 * The stored JWT is attached automatically by the request interceptor
 * in `src/api/client.ts`.
 *
 * Returns `true` when the server responds with 204 No Content.
 * Returns `false` for any other status — the caller should NOT clear
 * local auth state.
 */
export async function logout(): Promise<boolean> {
  try {
    await client.post("/api/auth/v1/logout")
    return true
  } catch {
    return false
  }
}
