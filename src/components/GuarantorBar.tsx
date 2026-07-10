import { useState } from "react"
import type { Guarantor } from "@/types/guarantor.types"
import { API_BASE_URL } from "@/config/api.config"

function extractName(g: Guarantor | string | undefined): string {
  if (!g) return ""
  if (typeof g === "string") return g
  return g.company?.name ?? ""
}

function resolveLogoUrl(g: Guarantor | string | undefined): string {
  if (!g || typeof g === "string") return "/sample-logo.png"
  const key = g.company?.logoKey
  if (!key) return "/sample-logo.png"
  const base = API_BASE_URL.replace(/\/+$/, "")
  const url = `${base}/files/v1/img/${key}`
  console.log("[GuarantorBar] logo URL:", url)
  return url
}

export default function GuarantorBar({ guarantor }: { guarantor: Guarantor | string | undefined }) {
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-foreground/80 via-foreground/60 to-transparent px-4 pb-3 pt-8">
      <img
        src={logoFailed ? "/sample-logo.png" : resolveLogoUrl(guarantor)}
        alt=""
        loading="lazy"
        onError={() => setLogoFailed(true)}
        className="h-9 w-auto rounded"
      />
      <span className="text-sm font-semibold text-background">{extractName(guarantor)}</span>
    </div>
  )
}
