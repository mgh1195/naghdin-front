import { useState, useEffect } from "react"
import { Menu, X, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { label: "خانه", href: "#hero" },
  { label: "فرصت‌های سرمایه‌گذاری", href: "#opportunities" },
  { label: "عملکرد ما", href: "#summary" },
  { label: "درباره ما", href: "#footer" },
]

export default function Navbar({ alwaysSolid }: { alwaysSolid?: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const visible = scrolled || alwaysSolid

  useEffect(() => {
    if (alwaysSolid) return
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [alwaysSolid])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        visible
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <TrendingUp className="size-5" />
          </span>
          <span
            className={cn(
              "text-lg font-bold tracking-tight transition-colors",
              visible ? "text-foreground" : "text-white",
            )}
          >
            سرمایه
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  visible
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/85 hover:text-white",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#opportunities"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            شروع سرمایه‌گذاری
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex size-10 items-center justify-center rounded-lg transition-colors md:hidden",
            visible || open ? "text-foreground" : "text-white",
          )}
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2">
              <a
                href="#opportunities"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                شروع سرمایه‌گذاری
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
