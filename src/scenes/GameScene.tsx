import { useRef } from 'react'
import { useGameLoop } from '../game/useGameLoop'
import { usePlayer, type Player, type Wire } from '../game/usePlayer'
import { useBubbles } from '../game/useBubbles'
import { useCollision } from '../game/useCollision'
import { CANVAS_WIDTH, CANVAS_HEIGHT, FLOOR_Y, BUBBLE_CONFIG } from '../game/constants'
import type { Bubble, BubbleLevel } from '../game/types'

interface Props {
  paused: boolean
}

const INITIAL_BUBBLES: { level: BubbleLevel; x: number; y: number }[] = [
  { level: 4, x: 300, y: 100 },
]

function drawBubble(ctx: CanvasRenderingContext2D, bubble: Bubble) {
  ctx.beginPath()
  ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
  ctx.fillStyle = BUBBLE_CONFIG[bubble.level].color
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 2
  ctx.stroke()
}

function draw(ctx: CanvasRenderingContext2D, player: Player, wire: Wire, bubbles: Bubble[]) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 배경
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 바닥
  ctx.fillStyle = '#444'
  ctx.fillRect(0, FLOOR_Y, CANVAS_WIDTH, CANVAS_HEIGHT - FLOOR_Y)

  // 버블
  for (const bubble of bubbles) {
    drawBubble(ctx, bubble)
  }

  // 와이어 (버블 위, 플레이어 아래에 렌더링)
  if (wire.active) {
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(wire.x, wire.bottomY)
    ctx.lineTo(wire.x, wire.y)
    ctx.stroke()
  }

  // 플레이어
  ctx.fillStyle = '#00ccff'
  ctx.fillRect(player.x, player.y, player.width, player.height)
}

export default function GameScene({ paused }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { playerRef, wireRef, update: updatePlayer } = usePlayer(paused)
  const { bubblesRef, updatePhysics, splitBubble } = useBubbles(INITIAL_BUBBLES)
  const { checkWireBubble } = useCollision(bubblesRef, wireRef, playerRef, splitBubble)

  useGameLoop(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    updatePlayer()
    updatePhysics()
    checkWireBubble()
    draw(ctx, playerRef.current, wireRef.current, bubblesRef.current)
  }, !paused)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#000' }}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  )
}
