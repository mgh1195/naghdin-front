import { ArrowLeft, ShieldCheck } from "lucide-react"

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[92vh] w-full overflow-hidden">
      {/* Background image */}
      <img
        src="/images/hero.png"
        alt="نمای شهری برج‌های اداری مدرن"
        className="absolute inset-0 size-full object-cover"
      />
      {/* Overlay for readability (RTL gradient) */}
      <div className="absolute inset-0 bg-gradient-to-l from-foreground/85 via-foreground/60 to-foreground/25" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pt-24 md:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-background/25 bg-background/10 px-4 py-1.5 text-sm font-medium text-background backdrop-blur-sm">
            <ShieldCheck className="size-4 text-accent" />
            سرمایه‌گذاری با ضمانت صندوق‌های پژوهش و فناوری
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight text-background text-balance md:text-6xl">
            سرمایه‌گذاری هوشمند در پروژه‌های فناورانه ایران
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-background/80 md:text-lg">
            با پلتفرم سرمایه، در فرصت‌های تامین مالی جمعی شرکت‌های دانش‌بنیان و
            پروژه‌های فناورانه با بازدهی شفاف و ضمانت معتبر مشارکت کنید.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#opportunities"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              مشاهده فرصت‌های سرمایه‌گذاری
              <ArrowLeft className="size-4" />
            </a>
            <a
              href="#summary"
              className="inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/10 px-7 py-3.5 text-sm font-semibold text-background backdrop-blur-sm transition-colors hover:bg-background/20"
            >
              عملکرد گذشته ما
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
