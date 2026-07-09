export default function GuarantorBar({ guarantor }: { guarantor: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-foreground/80 via-foreground/60 to-transparent px-4 pb-3 pt-8">
      <img
        src="/sample-logo.png"
        alt=""
        className="h-9 w-auto rounded"
      />
      <span className="text-sm font-semibold text-background">{guarantor}</span>
    </div>
  )
}