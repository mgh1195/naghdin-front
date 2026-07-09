// TODO: Replace with real API endpoint, e.g. POST /auth/send-otp
export async function sendOtp(phone: string): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // TODO: Call actual API — example:
  // const res = await fetch("/api/auth/send-otp", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ phone }),
  // })
  // if (!res.ok) throw new Error("ارسال کد با خطا مواجه شد")
}

// TODO: Replace with real API endpoint, e.g. POST /auth/verify-otp
export async function verifyOtp(
  phone: string,
  code: string,
): Promise<{ token: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Simulate a valid token for any 6-digit code
  return { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token" }

  // TODO: Call actual API — example:
  // const res = await fetch("/api/auth/verify-otp", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ phone, code }),
  // })
  // if (!res.ok) throw new Error("کد تایید نامعتبر است")
  // return res.json()
}