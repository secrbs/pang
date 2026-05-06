import { useRef } from 'react'
import { useGameLoop } from '../game/useGameLoop'
import { usePlayer, type Player, type Wire } from '../game/usePlayer'
import { useBubbles } from '../game/useBubbles'
import { useCollision } from '../game/useCollision'
import { CANVAS_WIDTH, CANVAS_HEIGHT, FLOOR_Y, BUBBLE_CONFIG } from '../game/constants'
import type { Bubble, BubbleLevel } from '../game/types'

interface Props {
  lives: number
  paused: boolean
  onPlayerDead: () => void
  onStageClear: () => void
}

const INITIAL_BUBBLES: { level: BubbleLevel; x: number; y: number }[] = [
  { level: 4, x: 300, y: 100 },
]

const INVINCIBLE_FRAMES = 120 // 약 2초 (60fps 기준)

function drawBubble(ctx: CanvasRenderingContext2D, bubble: Bubble) {
  ctx.beginPath()
  ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
  ctx.fillStyle = BUBBLE_CONFIG[bubble.level].color
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawHUD(ctx: CanvasRenderingContext2D, lives: number) {
  ctx.font = 'bold 18px "Courier New"'
  ctx.fillStyle = '#fff'
  ctx.fillText('LIVES', 12, 26)
  for (let i = 0; i < lives; i++) {
    ctx.fillStyle = '#ff4444'
    ctx.fillText('♥', 76 + i * 22, 26)
  }
}

function draw(
  ctx: CanvasRenderingContext2D,
  player: Player,
  wire: Wire,
  bubbles: Bubble[],
  lives: number,
  invincible: number,
) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx.fillStyle = '#444'
  ctx.fillRect(0, FLOOR_Y, CANVAS_WIDTH, CANVAS_HEIGHT - FLOOR_Y)

  for (const bubble of bubbles) drawBubble(ctx, bubble)

  if (wire.active) {
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(wire.x, wire.bottomY)
    ctx.lineTo(wire.x, wire.y)
    ctx.stroke()
  }

  // 무적 중 6프레임마다 깜빡임
  const showPlayer = invincible === 0 || Math.floor(invincible / 6) % 2 === 0
  if (showPlayer) {
    ctx.fillStyle = '#00ccff'
    ctx.fillRect(player.x, player.y, player.width, player.height)
  }

  drawHUD(ctx, lives)
}

export default function GameScene({ lives, paused, onPlayerDead, onStageClear }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const invincibleRef = useRef(0)
  const { playerRef, wireRef, update: updatePlayer } = usePlayer(paused)
  const { bubblesRef, updatePhysics, splitBubble } = useBubbles(INITIAL_BUBBLES)
  const { checkWireBubble, checkBubblePlayer } = useCollision(bubblesRef, wireRef, playerRef, splitBubble)

  useGameLoop(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    updatePlayer()
    updatePhysics()
    checkWireBubble()

    if (invincibleRef.current > 0) {
      invincibleRef.current--
    } else if (checkBubblePlayer()) {
      invincibleRef.current = INVINCIBLE_FRAMES
      onPlayerDead()
    }

    if (bubblesRef.current.length === 0) { onStageClear(); return }

    draw(ctx, playerRef.current, wireRef.current, bubblesRef.current, lives, invincibleRef.current)
  }, !paused)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#000' }}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  )
}
