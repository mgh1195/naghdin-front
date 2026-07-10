import client from "../client"
import type { Guarantor } from "@/types/guarantor.types"
import type { Company } from "@/types/company.types"
import type { Cheque } from "@/types/cheque.types"

export interface OverallStatistics {
  totalProjects: number
  totalAmount: number
  totalFundedCheques: number
  totalInvestors: number
  totalDistributedProfits: number
}

export async function getOverallStatistics(
  signal?: AbortSignal,
): Promise<OverallStatistics> {
  const { data } = await client.get<OverallStatistics>(
    "/v1/landing/overall-statistics",
    { signal },
  )
  return data
}

export type ProjectState =
  | "PENDING_FUNDRAISER"
  | "FUNDRAISER_APPROVED"
  | "PENDING_GUARANTOR"
  | "GUARANTOR_APPROVED"
  | "PENDING_INVESTMENT"
  | "INVESTED"
  | "ARCHIVED"

export const PROJECT_STATE_LABELS: Record<ProjectState, string> = {
  PENDING_FUNDRAISER: "در انتظار تامین مالی",
  FUNDRAISER_APPROVED: "تامین مالی شده",
  PENDING_GUARANTOR: "در انتظار تامین ضمانت",
  GUARANTOR_APPROVED: "تایید ضمانت شده",
  PENDING_INVESTMENT: "در حال جذب سرمایه",
  INVESTED: "سرمایه‌گذاری شده",
  ARCHIVED: "بایگانی شده",
}

const CLOSED_STATES: ProjectState[] = ["INVESTED", "ARCHIVED"]

export function isClosedState(state: ProjectState): boolean {
  return CLOSED_STATES.includes(state)
}

export interface ApiProject {
  id: string
  title: string
  description: string
  image?: string
  imageFileKey?: string
  logo?: string
  totalFunding?: number
  fundedPercent: number
  daysFrom: number
  daysTo: number
  amountFrom: number
  amountTo: number
  averageProfit: number
  guarantor: Guarantor | string
  company?: Company
  cheques?: Cheque[]
  state: ProjectState
}

export async function getProjects(
  state?: ProjectState,
  signal?: AbortSignal,
): Promise<ApiProject[]> {
  const { data } = await client.get<{ elements: ApiProject[] }>(
    "/v1/landing/projects",
    { params: state ? { state } : undefined, signal },
  )
  return data.elements
}
