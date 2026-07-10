# API Guide

## 1. Environment-based API URL

The API base URL is read from `VITE_API_BASE_URL` at build time and injected into the app.

| Mode | File | Value |
|------|------|-------|
| `npm run dev` | `.env.development` | `http://localhost:8080` |
| `npm run build` | `.env.production` | `https://api.domain.com` |

- **To change the URL for local dev**: edit `.env.development` and restart the dev server.
- **To change the production URL**: edit `.env.production` and rebuild.
- For reference, see the documented copy at `.env.example`.

The config lives at `src/config/api.config.ts`:
```ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ""
export const TIMEOUT = 10_000 // ms
```

## 2. Adding a New API Endpoint

1. Create a file at `src/api/endpoints/<resource>.api.ts` (e.g. `products.api.ts`).
2. Copy the template from `src/api/endpoints/users.api.ts`.
3. Define your response interface at the top of the file.
4. Export one function per endpoint, using the shared client.

**Example** — `src/api/endpoints/products.api.ts`:
```ts
import client from "../client"

export interface Product {
  id: number
  title: string
  price: number
}

export function getProducts() {
  return client.get<Product[]>("/products")
}

export function createProduct(data: Omit<Product, "id">) {
  return client.post<Product>("/products", data)
}
```

**Calling from a component**:
```tsx
import { getProducts, type Product } from "@/api/endpoints/products.api"
// …
const { data } = await getProducts()
```

## 3. Naming Conventions & File Rules

| Rule | Convention |
|------|------------|
| File location | `src/api/endpoints/<resource>.api.ts` — one file per resource |
| GET (by id) | `getResource(id)` → `client.get<T>(/resource/:id)` |
| GET (list) | `getResources()` → `client.get<T[]>(/resource)` |
| POST | `createResource(data)` → `client.post<T>(/resource, data)` |
| PUT/PATCH | `updateResource(id, data)` → `client.put<T>(/resource/:id, data)` |
| DELETE | `deleteResource(id)` → `client.delete<T>(/resource/:id)` |
| Types | Export the response interface (e.g. `Product`) from the **same file** — keeps the API contract co-located |
| Imports | Always import `client` from `../client` — never import `axios` directly |

## 4. Auth Token Interceptor

The request interceptor in `src/api/client.ts:18` reads the JWT from `localStorage` under the key `sarmaye_token`. This token is written by `AuthContext.login()` on a successful login and cleared by `AuthContext.logout()`.

The interceptor is fully wired — any request made through the shared `client` instance automatically includes the `Authorization: Bearer <token>` header while a user is logged in.

## 5. Login Flow (Phone + OTP)

The login flow has been migrated from fake/mock logic to real API calls. Both endpoints live in `src/api/endpoints/auth.api.ts`.

### Endpoints

| Step | Method | Path | Request body | Success |
|------|--------|------|-------------|---------|
| Send code | `POST` | `/api/auth/v1/verification-code` | `{ "id": "09…" }` | 204 No Content |
| Verify code | `POST` | `/api/auth/v1/login` | `{ "id": "09…", "code": "123456" }` | 200 with `{ token, currentUser }` |

### Token & user storage

On successful login, `AuthContext.login()` persists three values to `localStorage`:

| Key | Value |
|-----|-------|
| `sarmaye_token` | JWT string |
| `sarmaye_phone` | Phone number used to log in |
| `sarmaye_current_user` | `CurrentUser` object (JSON-serialized) |

Any component can access them via the `useAuth()` hook:

```tsx
import { useAuth } from "@/context/AuthContext"

function SomeComponent() {
  const { token, phone, currentUser, isAuthenticated, login, logout } = useAuth()
  // …
}
```

### `currentUser` type — optional fields

All fields inside `currentUser` (and its nested objects `user`, `person`, `company`, `metadata`, `inquiryResponse`) are typed as **optional** in `src/api/endpoints/auth.api.ts`. The backend may add or remove fields at any time. Components consuming `currentUser` should use optional chaining and handle `undefined` gracefully:

```tsx
const name = currentUser?.person?.firstName ?? currentUser?.user?.username ?? "کاربر"
```

### Error handling — NOT yet implemented

When `POST /api/auth/v1/verification-code` returns non-204, or `POST /api/auth/v1/login` returns non-200, the UI currently stays on the current screen with no specific error feedback. The loading state stops (button re-enables) but no message is shown. Implementing proper error UI for these cases is a future task.
