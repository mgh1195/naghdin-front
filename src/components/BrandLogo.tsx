import { cn } from "@/lib/utils"

const LOGO_SRC = "/icon/apple-touch-icon.png"

interface BrandLogoProps {
  /** "sm" = 36px (navbar/footer), "md" = 48px (login page) */
  size?: "sm" | "md"
  /** Render the wordmark text next to the logo */
  wordmark?: boolean
  /** Color overrides for the wordmark (depends on the surface behind it) */
  wordmarkClassName?: string
  className?: string
}

export default function BrandLogo({
  size = "sm",
  wordmark = false,
  wordmarkClassName,
  className,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-2", className)}>
      <img
        src={LOGO_SRC}
        alt="نقدین"
        className={cn("shrink-0", size === "sm" ? "size-9 rounded-xl" : "size-12 rounded-2xl")}
      />
      {wordmark && (
        <span
          className={cn(
            "text-lg font-bold tracking-tight transition-colors",
            wordmarkClassName,
          )}
        >
          نقدین
        </span>
      )}
    </span>
  )
}
