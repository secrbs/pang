import { useCallback, useEffect, useRef } from 'react'
import { CANVAS_WIDTH, FLOOR_Y, PLAYER_CONFIG, WIRE_CONFIG } from './constants'

export type Player = {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

export type Wire = {
  active: boolean
  x: number
  y: number       // 와이어 끝(tip) — 위로 이동
  bottomY: number // 와이어 시작점 — 고정
  speed: number
}

export function usePlayer(paused: boolean) {
  const playerRef = useRef<Player>({
    x: CANVAS_WIDTH / 2 - PLAYER_CONFIG.width / 2,
    y: FLOOR_Y - PLAYER_CONFIG.height,
    width: PLAYER_CONFIG.width,
    height: PLAYER_CONFIG.height,
    speed: PLAYER_CONFIG.speed,
  })

  const wireRef = useRef<Wire>({
    active: false,
    x: 0,
    y: 0,
    bottomY: 0,
    speed: WIRE_CONFIG.speed,
  })

  const keysRef = useRef<Set<string>>(new Set())
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      keysRef.current.add(e.key)
      if (e.key === ' ' && !pausedRef.current && !wireRef.current.active) {
        const p = playerRef.current
        const startY = p.y - WIRE_CONFIG.bottomOffset
        wireRef.current = {
          active: true,
          x: p.x + p.width / 2,
          y: startY,
          bottomY: startY,
          speed: WIRE_CONFIG.speed,
        }
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.key)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const update = useCallback(() => {
    const player = playerRef.current
    const keys = keysRef.current

    if (keys.has('ArrowLeft')) {
      player.x = Math.max(0, player.x - player.speed)
    }
    if (keys.has('ArrowRight')) {
      player.x = Math.min(CANVAS_WIDTH - player.width, player.x + player.speed)
    }

    const wire = wireRef.current
    if (wire.active) {
      wire.y -= wire.speed
      if (wire.y <= 0) wire.active = false
    }
  }, [])

  return { playerRef, wireRef, update }
}
