import { TrendingUp, Phone, Mail, MapPin, Globe, Send, MessageCircle } from "lucide-react"

const columns = [
  {
    title: "دسترسی سریع",
    links: ["خانه", "فرصت‌های سرمایه‌گذاری", "عملکرد ما", "سوالات متداول"],
  },
  {
    title: "خدمات",
    links: ["تامین مالی جمعی", "صندوق‌های سرمایه‌گذاری", "مشاوره مالی", "گزارش‌های عملکرد"],
  },
  {
    title: "قوانین",
    links: ["قوانین و مقررات", "حریم خصوصی", "راهنمای سرمایه‌گذاری", "افشای ریسک"],
  },
]

export default function Footer() {
  return (
    <footer id="footer" className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <TrendingUp className="size-5" />
              </span>
              <span className="text-lg font-bold">سرمایه</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-background/70">
              پلتفرم تامین مالی جمعی و سرمایه‌گذاری در پروژه‌های فناورانه با
              ضمانت صندوق‌های پژوهش و فناوری غیر دولتی. دارای مجوز رسمی فعالیت.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-accent" />
                <span className="font-num">۰۲۱ - ۹۱۰۰ ۰۰۰۰</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-accent" />
                info@sarmaye.example
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 text-accent" />
                تهران، خیابان ولیعصر، برج فناوری
              </li>
            </ul>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-background/70 transition-colors hover:text-background"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/15 pt-6 md:flex-row">
          <p className="text-xs text-background/60">
            © تمامی حقوق برای پلتفرم سرمایه محفوظ است. ۱۴۰۴
          </p>
          <div className="flex items-center gap-3">
            {[MessageCircle, Send, Globe].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex size-9 items-center justify-center rounded-full bg-background/10 text-background/80 transition-colors hover:bg-background/20 hover:text-background"
                aria-label="شبکه اجتماعی"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
