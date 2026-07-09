import { useMemo, useState } from "react"
import {
  getChecks,
  getOpportunities,
  type OpportunityStatusFilter,
} from "@/data/opportunities"
import { cn } from "@/lib/utils"
import OpportunityCard from "./OpportunityCard"
import CheckCard from "./CheckCard"

type View = "projects" | "checks"

const statusFilters: { value: OpportunityStatusFilter; label: string }[] = [
  { value: "open", label: "در حال تامین سرمایه" },
  { value: "closed", label: "خاتمه یافته" },
  { value: "all", label: "همه" },
]

export default function Opportunities() {
  const [view, setView] = useState<View>("projects")
  const [status, setStatus] = useState<OpportunityStatusFilter>("open")

  // در نسخه واقعی، تغییر status باعث فراخوانی مجدد API با فیلتر سمت سرور می‌شود.
  const filteredOpportunities = useMemo(() => getOpportunities(status), [status])
  const filteredChecks = useMemo(() => getChecks(status), [status])

  return (
    <section id="opportunities" className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold text-primary">فرصت‌های پیش‌رو</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground text-balance md:text-4xl">
            فرصت‌های سرمایه‌گذاری
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            پروژه‌های منتخب با بازدهی شفاف و ضمانت صندوق‌های معتبر. اطلاعات کامل
            هر فرصت را بررسی و آگاهانه سرمایه‌گذاری کنید.
          </p>
        </div>

        {/* سوییچ پروژه‌ها / چک‌ها و دکمه مشاهده همه در یک راستا */}
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

        {/* فیلتر وضعیت تامین مالی - برای هر دو نمای پروژه‌ها و چک‌ها */}
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
          filteredOpportunities.length > 0 ? (
            <div className="mt-8 flex flex-col gap-6">
              {filteredOpportunities.map((item) => (
                <OpportunityCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <p className="text-muted-foreground">
                در حال حاضر فرصتی با این وضعیت موجود نیست.
              </p>
            </div>
          )
        ) : filteredChecks.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChecks.map((item) => (
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
    </section>
  )
}
