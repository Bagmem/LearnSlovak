import { useState, useCallback } from "react"

export type AnimationType = "shake" | "bounce" | "none"

export function useAnimation(duration: number = 300) {
  const [animation, setAnimation] = useState<AnimationType>("none")

  const trigger = useCallback((type: AnimationType) => {
    setAnimation(type)
    setTimeout(() => setAnimation("none"), duration)
  }, [duration])

  return { animation, trigger }
}