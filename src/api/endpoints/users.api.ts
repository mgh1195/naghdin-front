import client from "../client"

// =============================================================================
//  PATTERN: API Endpoint Module
// -----------------------------------------------------------------------------
//  Each resource gets its own file under src/api/endpoints/ (e.g. users.api.ts,
//  opportunities.api.ts, orders.api.ts).
//
//  Conventions:
//  1. Import the shared axios client from `../client` (NEVER import axios directly).
//  2. Every function returns `client.get/post/put/delete<T>(…)` — the shared
//     client already includes the base URL, timeout, auth token, and error
//     logging interceptor.
//  3. Name GET functions `get<Resource>` (singular by id, plural for list).
//  4. Name mutation functions `create<Resource>`, `update<Resource>`, `delete<Resource>`.
//  5. Export typed response interfaces so callers get full type safety.
// =============================================================================

export interface User {
  id: number
  name: string
  email: string
  role: string
  createdAt: string
}

// GET /users/:id ---------------------------------------------------------------
/**
 * Fetch a single user by id.
 *
 * @example
 *   import { getUser } from "@/api/endpoints/users.api"
 *   const { data } = await getUser(42)
 */
export function getUser(id: number) {
  return client.get<User>(`/users/${id}`)
}

// POST /users ------------------------------------------------------------------
/**
 * Create a new user.
 *
 * @example
 *   import { createUser } from "@/api/endpoints/users.api"
 *   await createUser({ name: "Ali", email: "ali@example.com" })
 */
export function createUser(data: Omit<User, "id" | "createdAt">) {
  return client.post<User>("/users", data)
}

// ------------------------------------------------------------------------------
//  To add a NEW resource (e.g. products):
//
//  1. Copy this file → src/api/endpoints/products.api.ts
//  2. Replace "User" with "Product" everywhere.
//  3. Replace `/users` with `/products` in URLs.
//  4. Adjust the interface fields to match your Product schema.
// ------------------------------------------------------------------------------
