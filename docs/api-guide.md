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

The request interceptor in `src/api/client.ts` currently reads a token from `localStorage` under the key `sarmaye_token`. This is a **placeholder**.

When real authentication is wired up:
- Update the token source in `src/api/client.ts:18` to read from your actual auth state (context, secure cookie, or dedicated token manager).
- If auth is managed via `src/context/AuthContext.tsx`, consider exporting a `getToken()` helper from that module and calling it inside the interceptor.
