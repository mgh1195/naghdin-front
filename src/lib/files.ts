import { API_BASE_URL } from "@/config/api.config"

/**
 * Builds a public file URL for a file key returned by the API.
 *
 * The key is a path (e.g. "companies/CMP-3/projects/PRJ-22/image.png").
 * Only path segments are percent-encoded — the "/" separators must stay
 * literal, otherwise the server rejects the request with HTTP 400.
 */
export function buildFileUrl(fileKey: string): string {
  const key = fileKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
  const base = API_BASE_URL.replace(/\/+$/, "")
  return `${base}/files/v1/img/${key}`
}
