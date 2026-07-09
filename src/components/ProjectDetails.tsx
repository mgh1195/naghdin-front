import { useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, ShoppingCart, Trash2, Building2, FileText, MapPin, X, FileDown, FileImage, File } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import {
  getChecks,
  getOpportunityById,
  type OpportunityStatusFilter,
} from "@/data/opportunities"
import { cn, faNumber, toFa } from "@/lib/utils"
import { useCart } from "@/context/CartContext"
import { useAuthGuard } from "@/context/AuthModalContext"
import CheckCard from "./CheckCard"
import GuarantorBar from "./GuarantorBar"

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

  const documents = [
    { title: "طرح توجیهی پروژه", url: project.evaluationPdfUrl, type: "pdf" },
    { title: "تصویر پروانه بهره‌برداری", url: "/images/project-energy.png", type: "image" },
    { title: "گزارش مالی فصلی", url: "/docs/financial-report.pdf", type: "pdf" },
  ]

  const statusFilters: { value: OpportunityStatusFilter; label: string }[] = [
    { value: "open", label: "در حال تامین سرمایه" },
    { value: "closed", label: "خاتمه یافته" },
    { value: "all", label: "همه" },
  ]
  const [activeTab, setActiveTab] = useState<string>("company")
  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false)
  const [docModal, setDocModal] = useState<{ title: string; url: string; type: string } | null>(null)
  const [checkStatus, setCheckStatus] = useState<OpportunityStatusFilter>("open")
  const filteredChecks = useMemo(() => getChecks(checkStatus), [checkStatus])

  type ViewMode = "card" | "table"
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const { isInCart, addToCart, removeFromCart } = useCart()
  const { authenticate } = useAuthGuard()

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
            <GuarantorBar guarantor={project.guarantor} />
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

          </div>
        </div>

        <div className="border-t border-border/70 p-6 md:p-8">

          <div className="mt-6 inline-flex rounded-full border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                viewMode === "card"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              کارت چک
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                viewMode === "table"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              جدول چک
            </button>
          </div>

          <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
            {viewMode === "card" && (
              <a
                href="#"
                className="shrink-0 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background"
              >
                مشاهده همه چک‌ها
              </a>
            )}
          </div>

          {filteredChecks.length > 0 ? (
            viewMode === "card" ? (
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredChecks.slice(0, 3).map((item) => (
                  <CheckCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground">
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">ردیف</th>
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">تاریخ چک</th>
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">مبلغ چک (ریال)</th>
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">صادر کننده چک</th>
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">شناسه صیاد</th>
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">قیمت خرید چک</th>
                      <th className="whitespace-nowrap px-4 py-3 md:px-5">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChecks.slice(0, 3).map((item, idx) => {
                      const inCart = isInCart(item.id)
                      return (
                        <tr key={item.id} className="border-b border-border last:border-b-0">
                          <td className="whitespace-nowrap px-4 py-3 md:px-5 font-num text-xs text-muted-foreground">
                            {toFa(idx + 1)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 md:px-5 font-num text-xs text-foreground">
                            {item.date}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 md:px-5 font-num text-xs text-foreground">
                            {faNumber(item.chequeAmountRial)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 md:px-5 text-xs text-foreground">
                            {item.issuer}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 md:px-5 font-num text-xs text-foreground">
                            {item.sayadId}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 md:px-5 font-num text-xs text-foreground">
                            {faNumber(item.purchasePrice)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 md:px-5">
                            {inCart ? (
                              <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-colors hover:opacity-90"
                              >
                                <Trash2 className="size-3.5" />
                                حذف
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => authenticate(() => addToCart(item.id))}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:opacity-90"
                              >
                                <ShoppingCart className="size-3.5" />
                                افزودن به سبد خرید
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <p className="text-muted-foreground">
                در حال حاضر چکی با این وضعیت موجود نیست.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border/70 p-6 md:p-8">
          <div className="inline-flex rounded-full border border-border bg-card p-1">
            {(["company", "evaluation", "tab3"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab === "company" && "اطلاعات شرکت و طرح"}
                {tab === "evaluation" && "ارزیابی ما"}
                {tab === "tab3" && "مدارک و ضمائم"}
              </button>
            ))}
          </div>

          {activeTab === "company" && (
            <div className="mt-8 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              <div className="flex items-center justify-between border-b border-border/70 py-4">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">نام شرکت</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {project.companyName}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border/70 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">آدرس</span>
                </div>
                <span className="text-sm font-medium leading-relaxed text-foreground">
                  {project.address}
                </span>
              </div>

              <div className="py-5 sm:col-span-2">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">معرفی طرح</span>
                </div>
                <div className="mt-3 rounded-xl bg-muted/40 p-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    {project.planIntro}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "evaluation" && (
            <div className="mt-8 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              <div className="flex items-center justify-between border-b border-border/70 py-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-4 items-center justify-center rounded bg-primary/20 text-xs font-bold text-primary">!</span>
                  <span className="text-sm font-medium text-foreground">سابقه چک برگشتی</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {project.hasBouncedCheque ? "دارد" : "ندارد"}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-border/70 py-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-4 items-center justify-center rounded bg-primary/20 text-xs font-bold text-primary">★</span>
                  <span className="text-sm font-medium text-foreground">رتبه اعتباری</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {project.creditRating}
                </span>
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">فایل ارزیابی</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDocModal({ title: "فایل ارزیابی", url: "/sample-local-pdf.pdf", type: "pdf" })}
                  className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-background"
                >
                  مشاهده
                </button>
              </div>
            </div>
          )}

          {activeTab === "tab3" && (
            <div className="mt-8 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {documents.map((doc, idx) => (
                <div key={doc.title} className={`flex items-center justify-between py-4 ${idx < documents.length - 1 ? "border-b border-border/70" : ""}`}>
                  <div className="flex items-center gap-3">
                    {doc.type === "pdf" ? (
                      <FileText className="size-5 text-primary" />
                    ) : doc.type === "image" ? (
                      <FileImage className="size-5 text-primary" />
                    ) : (
                      <File className="size-5 text-primary" />
                    )}
                    <span className="text-sm font-medium text-foreground">{doc.title}</span>
                  </div>
                  {doc.type === "pdf" || doc.type === "image" ? (
                    <button
                      type="button"
                      onClick={() => setDocModal({ title: doc.title, url: doc.url, type: doc.type })}
                      className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-background"
                    >
                      مشاهده
                    </button>
                  ) : (
                    <a
                      href={doc.url}
                      download
                      className="shrink-0 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-background"
                    >
                      دانلود
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Evaluation PDF modal */}
          {evaluationModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 backdrop-blur-sm p-4"
              onClick={() => setEvaluationModalOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label="فایل ارزیابی"
            >
              <div
                className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-card"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <span className="text-sm font-bold text-foreground">فایل ارزیابی</span>
                  <button
                    type="button"
                    onClick={() => setEvaluationModalOpen(false)}
                    className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="بستن"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto bg-muted p-4">
                  <iframe
                    src={project.evaluationPdfUrl}
                    className="mx-auto h-[70vh] w-full rounded-lg border-0"
                    title="فایل ارزیابی"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Document modal */}
          {docModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/70 backdrop-blur-sm p-4"
              onClick={() => setDocModal(null)}
              role="dialog"
              aria-modal="true"
              aria-label={docModal.title}
            >
              <div
                className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-card"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <span className="text-sm font-bold text-foreground">{docModal.title}</span>
                  <button
                    type="button"
                    onClick={() => setDocModal(null)}
                    className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="بستن"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto bg-muted p-4">
                  {docModal.type === "image" ? (
                    <img
                      src={docModal.url}
                      alt={docModal.title}
                      className="mx-auto max-h-[70vh] w-auto rounded-lg object-contain"
                    />
                  ) : (
                    <iframe
                      src={docModal.url}
                      className="mx-auto h-[70vh] w-full rounded-lg border-0"
                      title={docModal.title}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
