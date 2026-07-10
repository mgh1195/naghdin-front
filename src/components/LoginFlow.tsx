import { useState, useEffect, useRef, useCallback } from "react"
import { Loader2, ArrowRight } from "lucide-react"
import { sendVerificationCode, verifyOtp } from "@/api/endpoints/auth.api"
import { useAuth } from "@/context/AuthContext"
import { normalizeDigits } from "@/lib/utils"

function isValidIranianPhone(phone: string): boolean {
  return /^09\d{9}$/.test(phone)
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

interface LoginFlowProps {
  onSuccess?: () => void
}

export default function LoginFlow({ onSuccess }: LoginFlowProps) {
  const { login } = useAuth()

  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [touched, setTouched] = useState(false)
  const [sending, setSending] = useState(false)

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [countdown, setCountdown] = useState(120)
  const [resending, setResending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const validationError =
    touched && phone.length > 0 && !isValidIranianPhone(phone)
      ? "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد"
      : null

  const valid = isValidIranianPhone(phone)
  const otpComplete = otp.every((d) => d !== "")

  const resetOtpState = useCallback(() => {
    setOtp(["", "", "", "", "", ""])
    setVerifyError(null)
  }, [])

  const handleSendOtp = async () => {
    if (!valid || sending) return
    setSending(true)
    try {
      const ok = await sendVerificationCode(phone)
      if (ok) {
        setStep("otp")
        setCountdown(120)
      }
    } finally {
      setSending(false)
    }
  }

  const handleResend = async () => {
    if (resending) return
    setResending(true)
    try {
      const ok = await sendVerificationCode(phone)
      if (ok) {
        setOtp(["", "", "", "", "", ""])
        setCountdown(120)
        inputRefs.current[0]?.focus()
      }
    } finally {
      setResending(false)
    }
  }

  const handleVerify = async () => {
    if (!otpComplete || verifying) return
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
  }

  const handleOtpChange = useCallback(
    (idx: number, value: string) => {
      const digit = normalizeDigits(value).replace(/\D/g, "").slice(0, 1)
      setOtp((prev) => {
        const next = [...prev]
        next[idx] = digit
        return next
      })
      if (digit && idx < 5) {
        inputRefs.current[idx + 1]?.focus()
      }
    },
    [],
  )

  const handleOtpKeyDown = useCallback(
    (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[idx] && idx > 0) {
        inputRefs.current[idx - 1]?.focus()
      }
      if (e.key === "Enter") {
        handleVerify()
      }
    },
    [otp],
  )

  useEffect(() => {
    if (step !== "otp") return
    if (countdown <= 0) return
    const id = setInterval(() => setCountdown((v) => v - 1), 1000)
    return () => clearInterval(id)
  }, [step, countdown])

  // Clear OTP state when the countdown expires
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

  const timerRunning = countdown > 0

  return (
    <>
      {step === "phone" && (
        <>
          <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
            برای ورود، شماره موبایل خود را وارد کنید. کد تایید برای شما پیامک خواهد شد.
          </p>

          <form
            className="mt-8 space-y-6"
            onSubmit={(e) => {
              e.preventDefault()
              handleSendOtp()
            }}
          >
            <div>
              <label htmlFor="phone" className="text-sm font-semibold text-foreground">
                شماره موبایل
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(normalizeDigits(e.target.value).replace(/\D/g, "").slice(0, 11))}
                onBlur={() => setTouched(true)}
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                autoComplete="tel"
                dir="ltr"
                disabled={sending}
                className={`mt-1.5 block w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${
                  validationError
                    ? "border-primary/40 focus:border-primary focus:ring-primary/30"
                    : "border-border focus:border-primary focus:ring-primary/30"
                }`}
              />
              {validationError && (
                <p className="mt-1.5 text-xs text-accent">{validationError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!valid || sending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sending && <Loader2 className="size-4 animate-spin" />}
              {sending ? "در حال ارسال..." : "دریافت کد"}
            </button>
          </form>
        </>
      )}

      {step === "otp" && (
        <>
          <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
            کد تایید به شماره {phone} ارسال شد.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <label className="text-sm font-semibold text-foreground">
                کد تایید
              </label>
              <div className="mt-2 flex items-center justify-center gap-2" dir="ltr">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onFocus={(e) => e.target.select()}
                    maxLength={1}
                    className="size-11 rounded-xl border border-border bg-card text-center text-lg font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
                  />
                ))}
              </div>
              {verifyError && (
                <p className="mt-2 text-center text-xs text-accent">{verifyError}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  resetOtpState()
                  setStep("phone")
                }}
                className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowRight className="size-4" />
                ویرایش شماره موبایل
              </button>
              {timerRunning ? (
                <span className="font-num text-muted-foreground">
                  {formatTime(countdown)}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="font-semibold text-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {resending ? "در حال ارسال..." : "ارسال مجدد کد"}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleVerify}
              disabled={!otpComplete || verifying}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {verifying && <Loader2 className="size-4 animate-spin" />}
              {verifying ? "در حال تایید..." : "تایید"}
            </button>
          </div>
        </>
      )}
    </>
  )
}