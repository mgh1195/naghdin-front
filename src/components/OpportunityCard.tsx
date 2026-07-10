import {ArrowLeft} from "lucide-react"
import {Link} from "react-router-dom"
import {useState, useEffect, useRef} from "react"
import type {Opportunity} from "@/data/opportunities"
import {faNumber, toFa} from "@/lib/utils"
import GuarantorBar from "./GuarantorBar"

function DetailRow({label, value}: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1 border-b border-border/70 py-3 last:border-b-0">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="font-num text-sm font-semibold text-foreground">{value}</span>
        </div>
    )
}

const PLACEHOLDER_SRC = "/placeholder.svg"

export default function OpportunityCard({item}: { item: Opportunity }) {
    const isClosed = item.status === "closed"
    const [imgSrc, setImgSrc] = useState(item.image || PLACEHOLDER_SRC)
    const prevImage = useRef(item.image)

    useEffect(() => {
        if (item.image === prevImage.current) return
        prevImage.current = item.image

        if (!item.image) {
            setImgSrc(PLACEHOLDER_SRC)
            return
        }

        setImgSrc(item.image)
    }, [item.image])

    return (
        <article className="overflow-hidden rounded-3xl border border-border bg-card transition-shadow hover:shadow-md">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
                <div className="relative h-56 lg:h-auto bg-muted">
                    <img
                        src={imgSrc}
                        alt={item.title}
                        loading="lazy"
                        onError={() => {
                            console.warn("[OpportunityCard] img failed, falling back:", imgSrc)
                            setImgSrc(PLACEHOLDER_SRC)
                        }}
                        className="size-full object-cover"
                    />
                    <span
                        className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                            isClosed
                                ? "bg-foreground/80 text-background"
                                : "bg-accent text-accent-foreground"
                        }`}
                    >
            {item.stateLabel || (isClosed ? "تکمیل شده" : "در حال جذب سرمایه")}
          </span>
                    <GuarantorBar guarantor={item.guarantor}/>
                </div>

                {/* Content side */}
                <div className="flex flex-col p-6 md:p-8">
                    <div className="flex items-start gap-4">
            <span
                className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
              {item.logo}
            </span>
                        <div>
                            <h3 className="text-lg font-bold leading-snug text-foreground text-balance md:text-xl">
                                {item.company?.name}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                    </div>

                    {/* Funding progress */}
                    <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">میزان تامین‌شده</span>
                            <span className="font-num font-bold text-primary">
                {toFa(item.fundedPercent)}٪
              </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{width: `${item.fundedPercent}%`}}
                            />
                        </div>
                    </div>

                    {/* Details grid */}
                    <div className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                        <DetailRow
                            label="مبلغ کل تامین‌مالی"
                            value={`${faNumber(item.totalFunding)} ریال`}
                        />
                        <DetailRow label="سود میانگین ماهانه" value={`${toFa(item.averageProfit)}٪`}/>
                        <DetailRow
                            label="بازه زمانی سرمایه‌گذاری"
                            value={`${toFa(item.daysFrom)} تا ${toFa(item.daysTo)} روز`}
                        />
                        <DetailRow
                            label="بازه مبالغ (ریال)"
                            value={`${faNumber(item.amountFrom)} تا ${faNumber(item.amountTo)}`}
                        />
                    </div>

                    <div className="mt-6">
                        <Link
                            to={`/projects/${item.id}`}
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            {isClosed ? "مشاهده جزئیات پروژه" : "سرمایه‌گذاری در این پروژه"}
                            <ArrowLeft className="size-4"/>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}
