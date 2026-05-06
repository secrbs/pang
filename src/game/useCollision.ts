import { useCallback } from 'react'
import type { MutableRefObject } from 'react'
import type { Player, Wire } from './usePlayer'
import type { Bubble } from './types'

function wireHitsBubble(wire: Wire, bubble: Bubble): boolean {
  const dx = wire.x - bubble.x
  const closestY = Math.max(wire.y, Math.min(bubble.y, wire.bottomY))
  const dy = closestY - bubble.y
  return dx * dx + dy * dy <= bubble.radius * bubble.radius
}

function bubbleHitsPlayer(bubble: Bubble, player: Player): boolean {
  const closestX = Math.max(player.x, Math.min(bubble.x, player.x + player.width))
  const closestY = Math.max(player.y, Math.min(bubble.y, player.y + player.height))
  const dx = bubble.x - closestX
  const dy = bubble.y - closestY
  return dx * dx + dy * dy < bubble.radius * bubble.radius
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
  }, [bubblesRef, wireRef, splitBubble])

  const checkBubblePlayer = useCallback(() => {
    const player = playerRef.current
    for (const bubble of bubblesRef.current) {
      if (bubbleHitsPlayer(bubble, player)) return true
    }
    return false
  }, [bubblesRef, playerRef])

  return { checkWireBubble, checkBubblePlayer }
}
