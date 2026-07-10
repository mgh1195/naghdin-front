import { useEffect, useMemo, useState, useCallback } from "react"
import {
  getChecks,
  type OpportunityStatusFilter,
  type Opportunity,
} from "@/data/opportunities"
import { cn } from "@/lib/utils"
import { getProjects } from "@/api/endpoints/landing.api"
import { mapApiProject } from "@/api/adapters/project.adapter"
import OpportunityCard from "./OpportunityCard"
import CheckCard from "./CheckCard"
import ErrorBoundary from "./ErrorBoundary"

type View = "projects" | "checks"

const statusFilters: { value: OpportunityStatusFilter; label: string }[] = [
  { value: "open", label: "در حال تامین سرمایه" },
  { value: "closed", label: "خاتمه یافته" },
  { value: "all", label: "همه" },
]

const PAGE_SIZE = 6

function statusToApiParam(
  status: OpportunityStatusFilter,
): "PENDING_INVESTMENT" | "INVESTED" | undefined {
  if (status === "open") return "PENDING_INVESTMENT"
  if (status === "closed") return "INVESTED"
  return undefined
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

function SkeletonCard() {
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="h-56 animate-pulse bg-muted lg:h-auto" />
        <div className="flex flex-col gap-4 p-6 md:p-8">
          <div className="flex gap-4">
            <div className="size-14 shrink-0 animate-pulse rounded-2xl bg-muted" />
            <div className="flex flex-1 flex-col gap-3">
              <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="h-2.5 w-full animate-pulse rounded-full bg-muted" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 animate-pulse rounded bg-muted" />
            <div className="h-12 animate-pulse rounded bg-muted" />
            <div className="h-12 animate-pulse rounded bg-muted" />
            <div className="h-12 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-12 w-40 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </article>
  )
}

export default function Opportunities() {
  const [view, setView] = useState<View>("projects")
  const [status, setStatus] = useState<OpportunityStatusFilter>("open")
  const [projects, setProjects] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const fetchProjects = useCallback(
    (signal?: AbortSignal) => {
      setLoading(true)
      setError(false)
      getProjects(statusToApiParam(status), signal)
        .then((res) => {
          setProjects(res.map(mapApiProject))
          setVisibleCount(PAGE_SIZE)
        })
        .catch((err) => {
          if (err?.name === "CanceledError") return
          console.error("[Projects] fetch failed:", err)
          setError(true)
        })
        .finally(() => setLoading(false))
    },
    [status],
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchProjects(controller.signal)
    return () => controller.abort()
  }, [fetchProjects])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [status, view])

  const filteredChecks = useMemo(() => getChecks(status), [status])
  const visibleProjects = projects.slice(0, visibleCount)
  const hasMore = visibleCount < projects.length

  const showLoadMore = view === "projects" && hasMore && !loading && !error

  return (
    <section id="opportunities" className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">
            فرصت‌های پیش‌رو
          </span>
          <h2 className="mt-3 text-3xl font-bold text-foreground text-balance md:text-4xl">
            فرصت‌های سرمایه‌گذاری
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            پروژه‌های منتخب با بازدهی شفاف و ضمانت صندوق‌های معتبر. اطلاعات کامل
            هر فرصت را بررسی و آگاهانه سرمایه‌گذاری کنید.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setView("projects")}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-semibold transition-colors",
                view === "projects"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              پروژه‌ها
            </button>
            <button
              type="button"
              onClick={() => setView("checks")}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-semibold transition-colors",
                view === "checks"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              چک‌ها
            </button>
          </div>
          <a
            href="#"
            className="shrink-0 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background"
          >
            مشاهده همه فرصت‌ها
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatus(filter.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                status === filter.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {view === "projects" ? (
          <>
            {loading ? (
              <div className="mt-8 flex flex-col gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                <p className="text-muted-foreground">
                  خطا در دریافت پروژه‌ها. لطفا دوباره تلاش کنید.
                </p>
                <button
                  type="button"
                  onClick={() => fetchProjects()}
                  className="mt-4 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background"
                >
                  تلاش مجدد
                </button>
              </div>
            ) : visibleProjects.length > 0 ? (
              <ErrorBoundary>
                <div className="mt-8 flex flex-col gap-6">
                  {visibleProjects.map((item) => (
                    <OpportunityCard key={item.id} item={item} />
                  ))}
                  {showLoadMore && (
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((c) =>
                          Math.min(c + PAGE_SIZE, projects.length),
                        )
                      }
                      className="mx-auto rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-background"
                    >
                      مشاهده بیشتر
                    </button>
                  )}
                </div>
              </ErrorBoundary>
            ) : (
              <EmptyState message="در حال حاضر فرصتی با این وضعیت موجود نیست." />
            )}
          </>
        ) : filteredChecks.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChecks.map((item) => (
              <CheckCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState message="در حال حاضر چکی با این وضعیت موجود نیست." />
        )}
      </div>
    </section>
  )
}
