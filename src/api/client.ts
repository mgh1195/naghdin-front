import axios from "axios"
import { API_BASE_URL, TIMEOUT } from "../config/api.config"

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
})

// ---------------------------------------------------------------------------
// Request interceptor — attach auth token when available
// ---------------------------------------------------------------------------
client.interceptors.request.use((config) => {
  // TODO: Replace localStorage key with your actual auth token storage once
  //       authentication is wired up (e.g. cookies, secure storage, context).
  const token = localStorage.getItem("sarmaye_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------------------------------------------------------------------------
// Response interceptor — normalise errors and log them in a consistent format
// ---------------------------------------------------------------------------
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const { config, response, message } = error
      console.error("[API]", {
        url: config?.url,
        method: config?.method?.toUpperCase(),
        status: response?.status,
        message,
        data: response?.data,
      })
    } else {
      console.error("[API] Unexpected error:", error)
    }
    return Promise.reject(error)
  },
)

export default client
