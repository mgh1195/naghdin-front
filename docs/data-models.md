# Data Models

Shared entity types live under `src/types/`. Every field is **optional by design** — the backend may add or remove fields at any time, so consuming code must handle `undefined` gracefully via optional chaining (`?.`) and fallback values.

## File index

| File | Exported interfaces |
|------|---------------------|
| `src/types/user.types.ts` | `User` |
| `src/types/company.types.ts` | `Company`, `CompanyMetadata`, `CompanyInquiryResponse` |
| `src/types/person.types.ts` | `Person` |
| `src/types/auth.types.ts` | `CurrentUser`, `LoginResponse` |

## Composition

`Person` imports `User` and `Company` — both are reused, never duplicated:

```ts
// src/types/person.types.ts
interface Person {
  userDto?: User      // ← from user.types.ts
  company?: Company   // ← from company.types.ts
  // …
}
```

`CurrentUser` and `LoginResponse` compose the above types for the auth flow:

```ts
// src/types/auth.types.ts
interface CurrentUser {
  user?: User      // ← User entity
  person?: Person  // ← Person entity (which itself contains User and Company)
}

interface LoginResponse {
  token?: string
  currentUser?: CurrentUser
}
```

## Enum-like fields

Some fields have known values documented in JSDoc comments (e.g. `type: "REAL"`, `companyType: "PRIVATE_JOINT_STOCK"`). These are typed as plain `string` — new backend values won't cause type errors.
