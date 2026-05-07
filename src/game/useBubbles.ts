import { useCallback, useRef } from 'react'
import { CANVAS_WIDTH, FLOOR_Y, GRAVITY, BUBBLE_CONFIG } from './constants'
import type { Bubble, BubbleLevel } from './types'
import type { WallData } from './stageData'

export function useBubbles(
  initial: { level: BubbleLevel; x: number; y: number }[],
  walls: WallData[],
) {
  const nextIdRef = useRef(initial.length)
  const wallsRef = useRef(walls)

  const makeBubble = useCallback((level: BubbleLevel, x: number, y: number, vx: number, initialVy?: number): Bubble => {
    const { radius, bounceVy } = BUBBLE_CONFIG[level]
    return { id: nextIdRef.current++, level, x, y, vx, vy: initialVy ?? 0, radius, bounceVy }
  }, [])

  const bubblesRef = useRef<Bubble[]>(
    initial.map((b, i) => {
      const { radius, bounceVy } = BUBBLE_CONFIG[b.level]
      return { id: i, level: b.level, x: b.x, y: b.y, vx: BUBBLE_CONFIG[b.level].vx, vy: 0, radius, bounceVy }
    })
  )

  const updatePhysics = useCallback(() => {
    for (const b of bubblesRef.current) {
      b.vy += GRAVITY
      b.x += b.vx
      b.y += b.vy

      // 벽 위 반사 (위에서 아래로 내려올 때만)
      if (b.vy > 0) {
        for (const w of wallsRef.current) {
          if (
            b.x + b.radius > w.x &&
            b.x - b.radius < w.x + w.width &&
            b.y + b.radius >= w.y &&
            b.y - b.radius < w.y
          ) {
            b.y = w.y - b.radius
            b.vy = b.bounceVy
            break
          }
        }
      }

      // 천장 반사
      if (b.y - b.radius <= 0) {
        b.y = b.radius
        b.vy = Math.abs(b.vy)
      }

      // 바닥 반사
      if (b.y + b.radius >= FLOOR_Y) {
        b.y = FLOOR_Y - b.radius
        b.vy = b.bounceVy
      }

      // 좌우 벽 반사
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
  }, [makeBubble])

  const killBubble = useCallback((id: number) => {
    bubblesRef.current = bubblesRef.current.filter(b => b.id !== id)
  }, [])

  return { bubblesRef, updatePhysics, splitBubble, killBubble }
}
