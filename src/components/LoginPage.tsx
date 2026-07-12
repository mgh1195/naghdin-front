import { useLocation, useNavigate } from "react-router-dom"
import { ShieldCheck, TrendingUp } from "lucide-react"
import LoginFlow from "./LoginFlow"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="login-glow login-glow-primary" aria-hidden="true" />
      <div className="login-glow login-glow-accent" aria-hidden="true" />

      <section className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/80 bg-card/90 shadow-2xl shadow-foreground/5 backdrop-blur md:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden flex-col justify-between bg-primary p-8 text-primary-foreground md:flex lg:p-10">
          <div>
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-primary-foreground/15 ring-1 ring-primary-foreground/20">
              <TrendingUp className="size-7" />
            </span>
            <h1 className="mt-8 max-w-sm text-3xl font-black leading-tight lg:text-4xl">
              ورود امن به پنل سرمایه‌گذاری
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-primary-foreground/75">
              دسترسی سریع با کد یک‌بارمصرف، بدون تغییر در فرایند اصلی احراز هویت.
            </p>
          </div>

          <div className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/10 p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary-foreground/15">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold">احراز هویت پیامکی</p>
                <p className="mt-1 text-xs text-primary-foreground/70">ساده، سریع و مناسب موبایل</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <div className="mx-auto w-full max-w-md">
            <div className="flex flex-col items-center text-center md:items-start md:text-right">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 md:hidden">
                <TrendingUp className="size-7" />
              </span>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-primary md:mt-0">
                ورود
              </p>
              <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
                خوش آمدید
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                شماره موبایل خود را وارد کنید تا کد تایید برای شما ارسال شود.
              </p>
            </div>

            <div className="mt-7">
              <LoginFlow
                onSuccess={() => {
                  const from = (location.state as { from?: string })?.from || "/"
                  navigate(from, { replace: true })
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
