import { useNavigate, useLocation } from "react-router-dom"
import { TrendingUp } from "lucide-react"
import LoginFlow from "./LoginFlow"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <TrendingUp className="size-6" />
          </span>
          <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">
            ورود
          </h1>
        </div>

        <LoginFlow
          onSuccess={() => {
            const from = (location.state as { from?: string })?.from || "/"
            navigate(from, { replace: true })
          }}
        />
      </div>
    </main>
  )
}