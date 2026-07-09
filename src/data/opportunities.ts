export interface Opportunity {
  id: string
  title: string
  description: string
  image: string
  logo: string // مونوگرام / حروف اختصاری
  totalFunding: number // ریال
  totalFundingLabel: string
  fundedPercent: number
  daysFrom: number
  daysTo: number
  amountFrom: number
  amountTo: number
  averageProfit: number // درصد ماهانه
  guarantor: string
  status: "open" | "closed"
  // اطلاعات صفحه جزئیات پروژه
  companyName: string
  planIntro: string
  address: string
  evaluationPdfUrl: string // فایل ارزیابی ما
  hasBouncedCheque: boolean // چک برگشتی دارد / ندارد
  creditRating: string // رتبه اعتباری
}

export const opportunities: Opportunity[] = [
  {
    id: "hooshmand-energy",
    title: "توسعه سامانه ذخیره‌سازی انرژی هوشمند",
    description:
      "تامین مالی خط تولید باتری‌های لیتیومی نسل جدید با بازدهی بالا برای شبکه‌های توزیع انرژی پاک.",
    image: "/images/project-energy.png",
    logo: "انرژی",
    totalFunding: 4_750_000_000,
    totalFundingLabel: "۴,۷۵۰ میلیارد ریال",
    fundedPercent: 100,
    daysFrom: 75,
    daysTo: 75,
    amountFrom: 1_350_000_000,
    amountTo: 3_400_000_000,
    averageProfit: 0.46,
    guarantor: "صندوق پژوهش و فناوری غیر دولتی توسعه فناوری‌های راهبردی",
    status: "closed",
    companyName: "شرکت انرژی هوشمند پایدار پارس",
    planIntro:
      "این طرح با هدف راه‌اندازی خط تولید باتری‌های لیتیومی نسل جدید با ظرفیت بالا و عمر چرخه بیشتر اجرا می‌شود. محصولات این خط تولید برای ذخیره‌سازی انرژی در شبکه‌های توزیع برق و نیروگاه‌های خورشیدی کاربرد دارد و بخشی از نیاز داخلی را جایگزین واردات می‌کند.",
    address: "تهران، شهرک علمی و تحقیقاتی، خیابان نوآوری، پلاک ۱۲",
    evaluationPdfUrl: "/docs/evaluation-energy.pdf",
    hasBouncedCheque: false,
    creditRating: "A+",
  },
  {
    id: "salamat-bio",
    title: "تجهیزات تشخیص زیستی آزمایشگاهی",
    description:
      "سرمایه در گردش شرکت دانش‌بنیان تولید کیت‌های تشخیص مولکولی برای صادرات به بازارهای منطقه‌ای.",
    image: "/images/project-bio.png",
    logo: "زیست",
    totalFunding: 3_200_000_000,
    totalFundingLabel: "۳,۲۰۰ میلیارد ریال",
    fundedPercent: 82,
    daysFrom: 60,
    daysTo: 90,
    amountFrom: 900_000_000,
    amountTo: 2_500_000_000,
    averageProfit: 0.51,
    guarantor: "صندوق نوآوری و شکوفایی معاونت علمی ریاست جمهوری",
    status: "open",
    companyName: "شرکت دانش‌بنیان تشخیص زیستی سلامت",
    planIntro:
      "تامین سرمایه در گردش برای افزایش ظرفیت تولید کیت‌های تشخیص مولکولی و توسعه بازار صادراتی در کشورهای منطقه. این شرکت دارای مجوزهای لازم بهداشتی و گواهی‌نامه‌های کیفیت بین‌المللی است.",
    address: "اصفهان، شهرک علمی و تحقیقاتی اصفهان، ساختمان فناوری، واحد ۷",
    evaluationPdfUrl: "/docs/evaluation-bio.pdf",
    hasBouncedCheque: false,
    creditRating: "A",
  },
  {
    id: "digital-agri",
    title: "پلتفرم کشاورزی دقیق و پایش هوشمند مزارع",
    description:
      "توسعه زیرساخت اینترنت اشیا و حسگرهای میدانی برای بهینه‌سازی مصرف آب و افزایش بهره‌وری محصول.",
    image: "/images/project-agri.png",
    logo: "کشت",
    totalFunding: 2_800_000_000,
    totalFundingLabel: "۲,۸۰۰ میلیارد ریال",
    fundedPercent: 47,
    daysFrom: 45,
    daysTo: 80,
    amountFrom: 500_000_000,
    amountTo: 1_800_000_000,
    averageProfit: 0.43,
    guarantor: "صندوق پژوهش و فناوری غیر دولتی توسعه فناوری‌های راهبردی",
    status: "open",
    companyName: "شرکت کشاورزی هوشمند دیجیتال مزرعه",
    planIntro:
      "توسعه زیرساخت اینترنت اشیا و استقرار حسگرهای میدانی برای پایش لحظه‌ای رطوبت خاک، دما و سلامت گیاه. هدف طرح کاهش مصرف آب و افزایش بهره‌وری محصولات کشاورزی از طریق تصمیم‌گیری داده‌محور است.",
    address: "شیراز، پارک علم و فناوری فارس، مرکز رشد، واحد ۲۱",
    evaluationPdfUrl: "/docs/evaluation-agri.pdf",
    hasBouncedCheque: true,
    creditRating: "B+",
  },
]

// فیلتر وضعیت فرصت‌ها. در نسخه واقعی این مقدار به‌عنوان query param به API ارسال
// می‌شود (مثلاً /api/opportunities?status=open) و فیلتر سمت سرور انجام می‌گیرد.
export type OpportunityStatusFilter = "open" | "closed" | "all"

export function getOpportunities(
  status: OpportunityStatusFilter,
): Opportunity[] {
  if (status === "all") return opportunities
  return opportunities.filter((item) => item.status === status)
}

export function getOpportunityById(id: string): Opportunity | undefined {
  return opportunities.find((item) => item.id === id)
}

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

// همانند فرصت‌ها، فیلتر چک‌ها نیز در نسخه واقعی سمت سرور انجام می‌شود
// (مثلاً /api/checks?status=open).
export function getChecks(status: OpportunityStatusFilter): Check[] {
  if (status === "all") return checks
  return checks.filter((item) => item.status === status)
}

export const summaryStats = [
  { label: "مجموع سرمایه جذب‌شده", value: "۱۲,۴۰۰", unit: "میلیارد ریال" },
  { label: "پروژه‌های تامین‌مالی‌شده", value: "۳۸", unit: "پروژه" },
  { label: "سرمایه‌گذاران فعال", value: "۹,۶۵۰", unit: "نفر" },
  { label: "سود پرداختی به سرمایه‌گذاران", value: "۱,۸۷۰", unit: "میلیارد ریال" },
]
