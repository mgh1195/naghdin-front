import { summaryStats } from "@/data/opportunities"

export default function SummaryStats() {
  return (
    <section id="summary" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold text-primary">عملکرد ما در یک نگاه</span>
        <h2 className="mt-3 text-3xl font-bold text-foreground text-balance md:text-4xl">
          خلاصه‌ای از سرمایه‌گذاری‌های گذشته
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          کارنامه شفاف ما نتیجه اعتماد هزاران سرمایه‌گذار و تامین مالی موفق ده‌ها
          پروژه فناورانه در سال‌های گذشته است.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-sm md:p-8"
          >
            <div className="font-num text-3xl font-black text-foreground md:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm font-medium text-primary">{stat.unit}</div>
            <div className="mt-3 text-xs leading-relaxed text-muted-foreground md:text-sm">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
