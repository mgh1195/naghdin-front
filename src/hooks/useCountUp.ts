import { useState, useEffect, useRef } from "react"

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function useCountUp(target: number, duration = 1500): number {
  const [value, setValue] = useState(0)
  const raf = useRef<number>(0)
  const startTime = useRef<number>(0)
  const prevTarget = useRef(target)
  const startValue = useRef(0)

  useEffect(() => {
    if (target !== prevTarget.current) {
      startValue.current = value
      prevTarget.current = target
    }
    startTime.current = 0

    const step = (now: number) => {
      if (!startTime.current) startTime.current = now
      const elapsed = now - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      const current =
        startValue.current + (target - startValue.current) * eased

      if (current === target) {
        setValue(target)
        return
      }

      setValue(Math.round(current))
      raf.current = requestAnimationFrame(step)
    }

    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return value
}
