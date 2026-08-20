import type { ApiProject } from "@/api/endpoints/landing.api"
import { PROJECT_STATE_LABELS, isClosedState } from "@/api/endpoints/landing.api"
import type { Opportunity, Check } from "@/data/opportunities"
import type { Guarantor } from "@/types/guarantor.types"
import type { Cheque } from "@/types/cheque.types"
import { buildFileUrl } from "@/lib/files"

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
  if (p.imageFileKey) return buildFileUrl(p.imageFileKey)
  if (p.image) return safeString(p.image)
  return "/placeholder.svg"
}

/**
 * Maps an API project response to the shape expected by OpportunityCard.
 */
export function mapApiProject(p: ApiProject): Opportunity {
  const cheques = Array.isArray(p.cheques) ? p.cheques : []
  const totalFunding =
    cheques
      .filter((c) => c.status === "PAID")
      .reduce((sum, c) => sum + c.amount, 0) || p.totalFunding || 0

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
    cheques: Array.isArray(p.cheques) && p.cheques.length > 0 ? p.cheques : undefined,
    fundedPercent: p.fundedPercent ?? 0,
    totalFunding,
    averageProfit: p.averageProfit ?? 0,
    daysFrom: p.daysFrom ?? 0,
    daysTo: p.daysTo ?? 0,
    amountFrom: p.amountFrom ?? 0,
    amountTo: p.amountTo ?? 0,
    companyName: safeString(p.company?.name),
    planIntro: "",
    address: "",
    evaluationPdfUrl: "",
    hasBouncedCheque: false,
    creditRating: "",
  }
}

export function mapChequeToCheck(c: Cheque): Check {
  return {
    id: c.id,
    title: c.projectTitle ?? "",
    image: "/placeholder.svg",
    fullImage: "/placeholder.svg",
    discountedAmount: c.investorAmount ?? 0,
    profit: c.feePercent ?? 0,
    guarantor: c.guarantorName ?? "",
    status: c.status === "AVAILABLE" ? "open" : "closed",
    date: c.dueDate ?? "",
    chequeAmountRial: c.amount ?? 0,
    issuer: c.issuerName ?? "",
    sayadId: c.chequeId ?? "",
    purchasePrice: c.investorAmount ?? 0,
  }
}
