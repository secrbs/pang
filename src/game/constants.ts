export const CANVAS_WIDTH = 800
export const CANVAS_HEIGHT = 600
export const FLOOR_Y = CANVAS_HEIGHT - 60

export const PLAYER_CONFIG = {
  width: 32,
  height: 48,
  speed: 6,
} as const

export const WIRE_CONFIG = {
  speed: 15,
} as const

export const GRAVITY = 0.4

export const BUBBLE_CONFIG: Record<number, {
  radius: number
  bounceVy: number
  vx: number
  color: string
}> = {
  1: { radius: 8,  bounceVy: -10, vx: 1.0, color: '#44aaff' },
  2: { radius: 14, bounceVy: -13, vx: 1.0, color: '#44ff88' },
  3: { radius: 22, bounceVy: -16, vx: 0.8, color: '#ffcc00' },
  4: { radius: 32, bounceVy: -19, vx: 0.7, color: '#ff8800' },
  5: { radius: 44, bounceVy: -22, vx: 0.6, color: '#ff4444' },
}
