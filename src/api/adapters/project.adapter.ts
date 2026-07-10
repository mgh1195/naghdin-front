import type { ApiProject } from "@/api/endpoints/landing.api"
import { PROJECT_STATE_LABELS, isClosedState } from "@/api/endpoints/landing.api"
import type { Opportunity } from "@/data/opportunities"
import type { Guarantor } from "@/types/guarantor.types"
import { API_BASE_URL } from "@/config/api.config"

function safeString(v: unknown): string {
  if (typeof v === "string") return v
  if (v && typeof v === "object") {
    const obj = v as Record<string, unknown>

    const company = obj.company
    if (company && typeof company === "object") {
      const co = company as Record<string, unknown>
      if (typeof co.name === "string") return co.name
    }

    const companyDto = obj.companyDto
    if (companyDto && typeof companyDto === "object") {
      const cd = companyDto as Record<string, unknown>
      if (typeof cd.name === "string") return cd.name
    }

    if (typeof obj.name === "string") return obj.name
    if (typeof obj.title === "string") return obj.title
  }
  return ""
}

function resolveImageUrl(p: ApiProject): string {
  if (p.imageFileKey) {
    const key = encodeURIComponent(p.imageFileKey)
    const base = API_BASE_URL.replace(/\/+$/, "")
    const url = `${base}/files/v1/img/${key}`
    console.log("[adapter] imageFileKey →", url)
    return url
  }
  if (p.image) return safeString(p.image)
  return "/placeholder.svg"
}

/**
 * Maps an API project response to the shape expected by OpportunityCard.
 */
export function mapApiProject(p: ApiProject): Opportunity {
  console.log("[adapter] raw guarantor:", p.guarantor)

  const totalFunding =
    p.cheques
      ?.filter((c) => c.status === "PAID")
      .reduce((sum, c) => sum + c.amount, 0) ?? p.totalFunding ?? 0

  return {
    id: safeString(p.id),
    title: safeString(p.title),
    description: safeString(p.description),
    image: resolveImageUrl(p),
    logo: safeString(p.logo),
    status: isClosedState(p.state) ? "closed" : "open",
    stateLabel: PROJECT_STATE_LABELS[p.state] ?? "",
    guarantor: p.guarantor as Guarantor,
    company: p.company,
    cheques: p.cheques,
    fundedPercent: p.fundedPercent ?? 0,
    totalFunding,
    totalFundingLabel: "",
    averageProfit: p.averageProfit ?? 0,
    daysFrom: p.daysFrom ?? 0,
    daysTo: p.daysTo ?? 0,
    amountFrom: p.amountFrom ?? 0,
    amountTo: p.amountTo ?? 0,
    companyName: "",
    planIntro: "",
    address: "",
    evaluationPdfUrl: "",
    hasBouncedCheque: false,
    creditRating: "",
  }
}
