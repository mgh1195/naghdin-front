import type { User } from "./user.types"
import type { Person } from "./person.types"

export interface CurrentUser {
  user?: User
  person?: Person
}

export interface LoginResponse {
  token?: string
  currentUser?: CurrentUser
}
