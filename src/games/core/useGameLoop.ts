import { useEffect, useRef } from 'react'

type LoopHandlers = {
  onUpdate: (deltaMs: number) => void
  onRender: () => void
  isRunning: boolean
}

export function useGameLoop({ onUpdate, onRender, isRunning }: LoopHandlers) {
  const lastTimeRef = useRef<number | null>(null)

  useEffect(() => {
    let rafId = 0
    const loop = (time: number) => {
      if (!isRunning) {
        lastTimeRef.current = time
        rafId = requestAnimationFrame(loop)
        return
      }

      const last = lastTimeRef.current ?? time
      const delta = Math.min(time - last, 50)
      lastTimeRef.current = time

      onUpdate(delta)
      onRender()
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [isRunning, onRender, onUpdate])
}
