import { useEffect, useLayoutEffect, useRef } from 'react'

export function useGameLoop(callback: () => void, active: boolean) {
  const callbackRef = useRef(callback)

  useLayoutEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    if (!active) return
    let rafId: number

    function loop() {
      callbackRef.current()
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [active])
}
