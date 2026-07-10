import { useState, useEffect } from "react"
import { useCountUp } from "@/hooks/useCountUp"
import { faNumber } from "@/lib/utils"
import {
  getOverallStatistics,
  type OverallStatistics,
} from "@/api/endpoints/landing.api"

interface StatDef {
  label: string
  unit: string
  format: (v: number) => string
  raw: number
}

function buildStats(data: OverallStatistics): StatDef[] {
  return [
    {
      label: "مجموع سرمایه جذب‌شده",
      unit: "میلیارد ریال",
      format: (v) => faNumber(Math.round(v / 1_000_000_000)),
      raw: data.totalAmount ?? 0,
    },
    {
      label: "پروژه‌های تامین‌مالی‌شده",
      unit: "پروژه",
      format: (v) => faNumber(v),
      raw: data.totalProjects ?? 0,
    },
    {
      label: "سرمایه‌گذاران فعال",
      unit: "نفر",
      format: (v) => faNumber(v),
      raw: data.totalInvestors ?? 0,
    },
    {
      label: "سود پرداختی به سرمایه‌گذاران",
      unit: "میلیارد ریال",
      format: (v) => faNumber(Math.round(v / 1_000_000_000)),
      raw: data.totalDistributedProfits ?? 0,
    },
  ]
}

function StatCard({ stat }: { stat: StatDef }) {
  const animated = useCountUp(stat.raw)

  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-sm md:p-8">
      <div className="font-num text-3xl font-black text-foreground md:text-4xl">
        {stat.format(animated)}
      </div>
      <div className="mt-1 text-sm font-medium text-primary">{stat.unit}</div>
      <div className="mt-3 text-xs leading-relaxed text-muted-foreground md:text-sm">
        {stat.label}
      </div>
    </div>
  )
}

function StatCardFallback() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-sm md:p-8">
      <div className="text-3xl font-black text-muted-foreground md:text-4xl">
        —
      </div>
      <div className="mt-1 h-4 w-16 animate-pulse rounded bg-muted mx-auto" />
      <div className="mt-3 h-4 w-24 animate-pulse rounded bg-muted mx-auto" />
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="mx-auto h-9 w-20 animate-pulse rounded bg-muted md:h-10 md:w-24" />
      <div className="mx-auto mt-1 h-4 w-16 animate-pulse rounded bg-muted" />
      <div className="mx-auto mt-3 h-4 w-24 animate-pulse rounded bg-muted" />
    </div>
  )
}

export default function SummaryStats() {
  const [data, setData] = useState<OverallStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    getOverallStatistics()
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const stats = data ? buildStats(data) : null

  return (
    <section
      id="summary"
      className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold text-primary">
          عملکرد ما در یک نگاه
        </span>
        <h2 className="mt-3 text-3xl font-bold text-foreground text-balance md:text-4xl">
          خلاصه‌ای از سرمایه‌گذاری‌های گذشته
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          کارنامه شفاف ما نتیجه اعتماد هزاران سرمایه‌گذار و تامین مالی موفق ده‌ها
          پروژه فناورانه در سال‌های گذشته است.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : error || !stats
            ? Array.from({ length: 4 }).map((_, i) => (
                <StatCardFallback key={i} />
              ))
            : stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </div>
    </section>
  )
}
