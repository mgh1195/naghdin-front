import { useState, useEffect, useRef, useCallback, type KeyboardEvent, type ReactNode } from "react"
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, RefreshCw } from "lucide-react"
import { sendVerificationCode, verifyOtp } from "@/api/endpoints/auth.api"
import { useAuth } from "@/context/AuthContext"
import { cn, normalizeDigits, toFa } from "@/lib/utils"

const OTP_LENGTH = 6
const OTP_TTL_SECONDS = 120

function createEmptyOtp(): string[] {
  return Array.from({ length: OTP_LENGTH }, () => "")
}

function isValidIranianPhone(phone: string): boolean {
  return /^09\d{9}$/.test(phone)
}

function getNumericValue(value: string, maxLength: number): string {
  return normalizeDigits(value).replace(/\D/g, "").slice(0, maxLength)
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return toFa(`${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`)
}

function formatPhone(phone: string): string {
  if (phone.length !== 11) return phone
  return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`
}

interface LoginFlowProps {
  onSuccess?: () => void
}

interface StatusMessageProps {
  tone: "error" | "success" | "info"
  children: ReactNode
}

function StatusMessage({ tone, children }: StatusMessageProps) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "error" ? AlertCircle : Loader2

  return (
    <div
      className={cn(
        "mt-3 flex items-start gap-2 rounded-2xl border px-3 py-2.5 text-xs leading-relaxed",
        tone === "error" && "border-accent/30 bg-accent/10 text-accent-foreground",
        tone === "success" && "border-primary/20 bg-primary/10 text-primary",
        tone === "info" && "border-border bg-muted/60 text-muted-foreground",
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", tone === "info" && "animate-spin")} />
      <span>{children}</span>
    </div>
  )
}

export default function LoginFlow({ onSuccess }: LoginFlowProps) {
  const { login } = useAuth()

  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const [otp, setOtp] = useState<string[]>(() => createEmptyOtp())
  const [countdown, setCountdown] = useState(OTP_TTL_SECONDS)
  const [resending, setResending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const phoneIsValid = isValidIranianPhone(phone)
  const otpIsComplete = otp.every(Boolean)
  const timerIsRunning = countdown > 0
  const phoneValidationError =
    phoneTouched && phone.length > 0 && !phoneIsValid
      ? "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد."
      : null

  const resetOtpState = useCallback(() => {
    setOtp(createEmptyOtp())
    setVerifyError(null)
  }, [])

  const handlePhoneChange = (value: string) => {
    setPhone(getNumericValue(value, 11))
    setSendError(null)
  }

  const handleSendOtp = async () => {
    if (!phoneIsValid || sending) return
    setSending(true)
    setSendError(null)
    try {
      const ok = await sendVerificationCode(phone)
      if (ok) {
        resetOtpState()
        setStep("otp")
        setCountdown(OTP_TTL_SECONDS)
      } else {
        setSendError("ارسال کد تایید انجام نشد. لطفاً چند لحظه دیگر دوباره تلاش کنید.")
      }
    } finally {
      setSending(false)
    }
  }

  const handleResend = async () => {
    if (resending) return
    setResending(true)
    setVerifyError(null)
    try {
      const ok = await sendVerificationCode(phone)
      if (ok) {
        resetOtpState()
        setCountdown(OTP_TTL_SECONDS)
        inputRefs.current[0]?.focus()
      } else {
        setVerifyError("ارسال مجدد کد انجام نشد. لطفاً دوباره تلاش کنید.")
      }
    } finally {
      setResending(false)
    }
  }

  const handleVerify = useCallback(async () => {
    if (!otpIsComplete || verifying) return
    setVerifying(true)
    setVerifyError(null)
    try {
      const { token, currentUser } = await verifyOtp(phone, otp.join(""))
      if (token) {
        login(token, phone, currentUser)
        onSuccess?.()
      } else {
        setVerifyError("کد وارد شده نامعتبر است. لطفاً مجدداً تلاش کنید.")
      }
    } catch {
      setVerifyError("کد وارد شده نامعتبر است. لطفاً مجدداً تلاش کنید.")
    } finally {
      setVerifying(false)
    }
  }, [login, onSuccess, otp, otpIsComplete, phone, verifying])

  const handleOtpChange = useCallback((index: number, value: string) => {
    const digits = getNumericValue(value, OTP_LENGTH)
    if (!digits) {
      setOtp((previous) => {
        const next = [...previous]
        next[index] = ""
        return next
      })
      return
    }

    setVerifyError(null)
    setOtp((previous) => {
      const next = [...previous]
      digits.split("").forEach((digit, offset) => {
        const targetIndex = index + offset
        if (targetIndex < OTP_LENGTH) next[targetIndex] = digit
      })
      return next
    })

    const nextFocusIndex = Math.min(index + digits.length, OTP_LENGTH - 1)
    inputRefs.current[nextFocusIndex]?.focus()
  }, [])

  const handleOtpKeyDown = useCallback(
    (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      if (event.key === "Enter") {
        handleVerify()
      }
    },
    [handleVerify, otp],
  )

  useEffect(() => {
    if (step !== "otp" || countdown <= 0) return
    const id = window.setInterval(() => setCountdown((value) => value - 1), 1000)
    return () => window.clearInterval(id)
  }, [step, countdown])

  useEffect(() => {
    if (step === "otp" && countdown === 0) {
      resetOtpState()
    }
  }, [step, countdown, resetOtpState])

  useEffect(() => {
    if (step === "otp") {
      requestAnimationFrame(() => inputRefs.current[0]?.focus())
    }
  }, [step])

  return (
    <div className="space-y-7">
      {step === "phone" && (
        <>
          <div className="text-center">
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              برای ورود، شماره موبایل خود را وارد کنید. کد تایید برای شما پیامک خواهد شد.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              setPhoneTouched(true)
              handleSendOtp()
            }}
          >
            <div>
              <label htmlFor="phone" className="text-sm font-bold text-foreground">
                شماره موبایل
              </label>
              <div className="relative mt-2">
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  onBlur={() => setPhoneTouched(true)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  autoComplete="tel"
                  dir="ltr"
                  disabled={sending}
                  aria-invalid={Boolean(phoneValidationError || sendError)}
                  aria-describedby="phone-feedback"
                  className={cn(
                    "block min-h-12 w-full rounded-2xl border bg-card px-4 py-3 text-left text-base font-medium text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
                    phoneValidationError || sendError
                      ? "border-accent/50 focus:border-accent focus:ring-accent/15"
                      : "border-border focus:border-primary focus:ring-primary/15",
                  )}
                />
              </div>
              <div id="phone-feedback">
                {phoneValidationError && <StatusMessage tone="error">{phoneValidationError}</StatusMessage>}
                {sendError && <StatusMessage tone="error">{sendError}</StatusMessage>}
                {sending && <StatusMessage tone="info">در حال ارسال کد تایید...</StatusMessage>}
              </div>
            </div>

            <button
              type="submit"
              disabled={!phoneIsValid || sending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:shadow-primary/25 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:text-base"
            >
              {sending && <Loader2 className="size-4 animate-spin" />}
              {sending ? "در حال ارسال..." : "دریافت کد"}
            </button>
          </form>
        </>
      )}

      {step === "otp" && (
        <>
          <div className="text-center">
            <StatusMessage tone="success">
              کد تایید به شماره{" "}
              <span dir="ltr" className="inline-block font-num font-bold text-primary">
                {formatPhone(phone)}
              </span>{" "}
              ارسال شد.
            </StatusMessage>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-bold text-foreground">کد تایید</label>
              <div className="mt-3 grid grid-cols-6 gap-2 sm:gap-3" dir="ltr">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element
                    }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onFocus={(event) => event.target.select()}
                    maxLength={OTP_LENGTH}
                    aria-label={`رقم ${toFa(index + 1)} کد تایید`}
                    className="aspect-square min-h-11 w-full rounded-2xl border border-border bg-card text-center text-lg font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15 sm:min-h-12 sm:text-xl"
                  />
                ))}
              </div>
              {verifyError && <StatusMessage tone="error">{verifyError}</StatusMessage>}
              {verifying && <StatusMessage tone="info">در حال بررسی کد تایید...</StatusMessage>}
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  resetOtpState()
                  setSendError(null)
                  setStep("phone")
                }}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full px-3 font-semibold text-muted-foreground transition-colors hover:bg-card hover:text-foreground sm:justify-start"
              >
                <ArrowRight className="size-4" />
                ویرایش شماره موبایل
              </button>
              {timerIsRunning ? (
                <span className="inline-flex min-h-10 items-center justify-center rounded-full bg-card px-3 font-num font-bold text-muted-foreground">
                  {formatTime(countdown)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-3 font-bold text-primary transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resending && <RefreshCw className="size-4 animate-spin" />}
                  {resending ? "در حال ارسال..." : "ارسال مجدد کد"}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleVerify}
              disabled={!otpIsComplete || verifying}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:shadow-primary/25 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:text-base"
            >
              {verifying && <Loader2 className="size-4 animate-spin" />}
              {verifying ? "در حال تایید..." : "تایید و ورود"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
