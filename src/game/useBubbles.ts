import { useCallback, useRef } from 'react'
import { CANVAS_WIDTH, FLOOR_Y, GRAVITY, BUBBLE_CONFIG } from './constants'
import type { Bubble, BubbleLevel } from './types'

let nextId = 0

function makeBubble(level: BubbleLevel, x: number, y: number, vx: number, initialVy?: number): Bubble {
  const { radius, bounceVy } = BUBBLE_CONFIG[level]
  return { id: nextId++, level, x, y, vx, vy: initialVy ?? 0, radius, bounceVy }
}

export function useBubbles(initial: { level: BubbleLevel; x: number; y: number }[]) {
  const bubblesRef = useRef<Bubble[]>(
    initial.map(b => makeBubble(b.level, b.x, b.y, BUBBLE_CONFIG[b.level].vx))
  )

  const updatePhysics = useCallback(() => {
    for (const b of bubblesRef.current) {
      b.vy += GRAVITY
      b.x += b.vx
      b.y += b.vy

      if (b.y + b.radius >= FLOOR_Y) {
        b.y = FLOOR_Y - b.radius
        b.vy = b.bounceVy
      }

      if (b.x - b.radius <= 0) {
        b.x = b.radius
        b.vx = Math.abs(b.vx)
      } else if (b.x + b.radius >= CANVAS_WIDTH) {
        b.x = CANVAS_WIDTH - b.radius
        b.vx = -Math.abs(b.vx)
      }
    }
  }, [])

  const splitBubble = useCallback((id: number) => {
    const idx = bubblesRef.current.findIndex(b => b.id === id)
    if (idx === -1) return

    const parent = bubblesRef.current[idx]
    bubblesRef.current.splice(idx, 1)

    if (parent.level > 1) {
      const childLevel = (parent.level - 1) as BubbleLevel
      const childVx = BUBBLE_CONFIG[childLevel].vx
      bubblesRef.current.push(
        makeBubble(childLevel, parent.x, parent.y, -childVx, parent.vy),
        makeBubble(childLevel, parent.x, parent.y,  childVx, parent.vy),
      )
    }
  }, [])

  return { bubblesRef, updatePhysics, splitBubble }
}
