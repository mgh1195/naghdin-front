import { useMemo, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import {
  getChecks,
  getOpportunityById,
  type OpportunityStatusFilter,
} from "@/data/opportunities"
import { cn, faNumber, toFa } from "@/lib/utils"
import CheckCard from "./CheckCard"

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/70 py-3 last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-num text-sm font-semibold text-foreground">{value}</span>
    </div>
  )
}

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const project = id ? getOpportunityById(id) : undefined

  if (!project) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">پروژه مورد نظر یافت نشد</h1>
          <p className="mt-3 text-muted-foreground">
            پروژه‌ای با شناسه «{id}» وجود ندارد.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ArrowRight className="size-4" />
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </main>
    )
  }

  const isClosed = project.status === "closed"

  const statusFilters: { value: OpportunityStatusFilter; label: string }[] = [
    { value: "open", label: "در حال تامین سرمایه" },
    { value: "closed", label: "خاتمه یافته" },
    { value: "all", label: "همه" },
  ]
  const [checkStatus, setCheckStatus] = useState<OpportunityStatusFilter>("open")
  const filteredChecks = useMemo(() => getChecks(checkStatus), [checkStatus])

  return (
    <main className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight className="size-4" />
        بازگشت به فرصت‌ها
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
        <div className="flex flex-col md:flex-row">
          {/* Image side — first in DOM, so in RTL flex-row it lands on the right */}
          <div className="relative h-72 md:h-auto md:w-2/3 md:shrink-0">
            <img
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              className="size-full object-cover"
            />
            <span
              className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                isClosed
                  ? "bg-foreground/80 text-background"
                  : "bg-accent text-accent-foreground"
              }`}
            >
              {isClosed ? "تکمیل شده" : "در حال جذب سرمایه"}
            </span>
          </div>

          {/* Content side — second in DOM, so in RTL flex-row it lands on the left */}
          <div className="flex flex-col p-6 md:p-8 md:w-1/3 md:shrink-0">
            <div className="flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                {project.logo}
              </span>
              <div>
                <h1 className="text-lg font-bold leading-snug text-foreground text-balance md:text-xl">
                  {project.title}
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">میزان تامین‌شده</span>
                <span className="font-num font-bold text-primary">
                  {toFa(project.fundedPercent)}٪
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${project.fundedPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col">
              <div className="flex items-center justify-between border-b border-border/70 py-3">
                <span className="text-xs text-muted-foreground">مبلغ کل تامین‌مالی</span>
                <span className="font-num text-sm font-semibold text-foreground">{project.totalFundingLabel}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 py-3">
                <span className="text-xs text-muted-foreground">سود میانگین ماهانه</span>
                <span className="font-num text-sm font-semibold text-foreground">{toFa(project.averageProfit)}٪</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/70 py-3">
                <span className="text-xs text-muted-foreground">بازه زمانی سرمایه‌گذاری</span>
                <span className="font-num text-sm font-semibold text-foreground">
                  {toFa(project.daysFrom)} تا {toFa(project.daysTo)} روز
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-xs text-muted-foreground">بازه مبالغ (ریال)</span>
                <span className="font-num text-sm font-semibold text-foreground">
                  {faNumber(project.amountFrom)} تا {faNumber(project.amountTo)}
                </span>
              </div>
            </div>

            <div className="mt-2 border-t border-border/70 pt-4">
              <span className="text-xs text-muted-foreground">ضامن</span>
              <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                {project.guarantor}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/70 p-6 md:p-8">

          <div className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setCheckStatus(filter.value)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    checkStatus === filter.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <a
              href="#"
              className="shrink-0 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background"
            >
              مشاهده همه چک‌ها
            </a>
          </div>

          {filteredChecks.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredChecks.slice(0, 3).map((item) => (
                <CheckCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <p className="text-muted-foreground">
                در حال حاضر چکی با این وضعیت موجود نیست.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
