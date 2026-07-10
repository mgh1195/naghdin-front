export type ChequeStatus = "AVAILABLE" | "LOCKED" | "PAID"

export const CHEQUE_STATUS_LABELS: Record<ChequeStatus, string> = {
  AVAILABLE: "قابل خرید",
  LOCKED: "در حال خرید توسط شخص دیگر",
  PAID: "خریداری شده",
}

export interface Cheque {
  id: string
  projectId: string
  issuerName: string
  dueDate: string
  amount: number
  chequeId: string
  chequeNumber: string
  nationalCode: string
  annualFeeRate: number
  investorAmount: number
  guarantorAmount: number
  investeeAmount: number
  platformAmount: number
  status: ChequeStatus
  projectTitle: string
  ownerPersonName: string
  ownerPersonType: string
  guarantorName: string
  feePercent: number
}
