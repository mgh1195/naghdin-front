import client from "../client"

export interface OverallStatistics {
  totalProjects: number
  totalAmount: number
  totalFundedCheques: number
  totalInvestors: number
  totalDistributedProfits: number
}

export async function getOverallStatistics(): Promise<OverallStatistics> {
  const { data } = await client.get<OverallStatistics>(
    "/v1/landing/overall-statistics",
  )
  return data
}
