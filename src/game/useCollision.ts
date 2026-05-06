import { useCallback } from 'react'
import type { MutableRefObject } from 'react'
import type { Player, Wire } from './usePlayer'
import type { Bubble } from './types'

// 수직 선분(x=wire.x, y: wireY~playerY)과 원의 충돌 감지
function wireHitsBubble(wire: Wire, bubble: Bubble): boolean {
  const dx = wire.x - bubble.x
  // 수직 선분(wire.y ~ wire.bottomY) 위의 bubble.y에 가장 가까운 점
  const closestY = Math.max(wire.y, Math.min(bubble.y, wire.bottomY))
  const dy = closestY - bubble.y
  return dx * dx + dy * dy <= bubble.radius * bubble.radius
}

export function useCollision(
  bubblesRef: MutableRefObject<Bubble[]>,
  wireRef: MutableRefObject<Wire>,
  playerRef: MutableRefObject<Player>,
  splitBubble: (id: number) => void,
) {
  const checkWireBubble = useCallback(() => {
    const wire = wireRef.current
    if (!wire.active) return

    for (const bubble of bubblesRef.current) {
      if (wireHitsBubble(wire, bubble)) {
        splitBubble(bubble.id)
        wire.active = false
        return
      }
    }
  }, [bubblesRef, wireRef, playerRef, splitBubble])

  return { checkWireBubble }
}
