import {Guarantor} from "@/types/guarantor.types.ts";
import type { Company } from "@/types/company.types"
import type { Cheque } from "@/types/cheque.types"

export interface Opportunity {
    id: string
    title: string
    description: string
    image: string
    logo: string // مونوگرام / حروف اختصاری
    totalFunding: number // ریال
    fundedPercent: number
    daysFrom: number
    daysTo: number
    amountFrom: number
    amountTo: number
    averageProfit: number // درصد ماهانه
    guarantor: Guarantor
    company?: Company
    cheques?: Cheque[]
    status: "open" | "closed"
    stateLabel: string
    // اطلاعات صفحه جزئیات پروژه
    companyName: string
    planIntro: string
    address: string
    evaluationPdfUrl: string // فایل ارزیابی ما
    hasBouncedCheque: boolean // چک برگشتی دارد / ندارد
    creditRating: string // رتبه اعتباری
}

export type OpportunityStatusFilter = "open" | "closed" | "all"

export interface Check {
    id: string
    title: string
    image: string // تصویر بندانگشتی چک (نسبت ۲:۱ - ۱۷۰×۸۵ میلی‌متر)
    fullImage: string // تصویر واقعی چک برای نمایش در مدال
    discountedAmount: number // مبلغ پس از تنزل (تومان)
    profit: number // سود سرمایه‌گذاری (درصد)
  guarantor: string
  status: "open" | "closed"
  // فیلدهای نمای جدولی
    date: string // تاریخ چک
    chequeAmountRial: number // مبلغ چک (ریال)
    issuer: string // صادرکننده چک
    sayadId: string // شناسه صیاد
    purchasePrice: number // قیمت خرید چک (ریال)
}

export const checks: Check[] = [
    {
        id: "check-parsian-1",
        title: "پارسیان رزین آمود",
        image: "/images/check-1.png",
        fullImage: "/images/check-1.png",
        discountedAmount: 1_230_462_960,
        profit: 0.45,
        guarantor: "پارسیان رزین آمود اسپادانا",
        status: "open",
        date: "۱۴۰۳/۰۸/۱۵",
        chequeAmountRial: 12_500_000_000,
        issuer: "پارسیان رزین آمود اسپادانا",
        sayadId: "۱۲۳۴۵۶۷۸۹۰۱۲۳۴۵۶",
        purchasePrice: 12_304_629_600,
    },
    {
        id: "check-parsian-2",
        title: "پارسیان رزین آمود",
        image: "/images/check-2.png",
        fullImage: "/images/check-2.png",
        discountedAmount: 2_480_750_000,
        profit: 0.48,
        guarantor: "پارسیان رزین آمود اسپادانا",
        status: "open",
        date: "۱۴۰۳/۰۹/۲۰",
        chequeAmountRial: 25_000_000_000,
        issuer: "پارسیان رزین آمود اسپادانا",
        sayadId: "۲۳۴۵۶۷۸۹۰۱۲۳۴۵۶۷",
        purchasePrice: 24_807_500_000,
    },
    {
        id: "check-parsian-3",
        title: "پارسیان رزین آمود",
        image: "/images/check-3.png",
        fullImage: "/images/check-3.png",
        discountedAmount: 875_320_500,
        profit: 0.43,
        guarantor: "پارسیان رزین آمود اسپادانا",
        status: "closed",
        date: "۱۴۰۳/۰۷/۰۵",
        chequeAmountRial: 8_900_000_000,
        issuer: "پارسیان رزین آمود اسپادانا",
        sayadId: "۳۴۵۶۷۸۹۰۱۲۳۴۵۶۷۸",
        purchasePrice: 8_753_205_000,
    },
]

export function getChecks(status: OpportunityStatusFilter): Check[] {
    if (status === "all") return checks
    return checks.filter((item) => item.status === status)
}
