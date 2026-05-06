import { useRef } from 'react'
import { useGameLoop } from '../game/useGameLoop'
import { usePlayer, type Player, type Wire } from '../game/usePlayer'
import { CANVAS_WIDTH, CANVAS_HEIGHT, FLOOR_Y } from '../game/constants'

interface Props {
  paused: boolean
}

function draw(ctx: CanvasRenderingContext2D, player: Player, wire: Wire) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 배경
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 바닥
  ctx.fillStyle = '#444'
  ctx.fillRect(0, FLOOR_Y, CANVAS_WIDTH, CANVAS_HEIGHT - FLOOR_Y)

  // 와이어
  if (wire.active) {
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(wire.x, player.y)
    ctx.lineTo(wire.x, wire.y)
    ctx.stroke()
  }

  // 플레이어
  ctx.fillStyle = '#00ccff'
  ctx.fillRect(player.x, player.y, player.width, player.height)
}

export default function GameScene({ paused }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { playerRef, wireRef, update } = usePlayer(paused)

  useGameLoop(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    update()
    draw(ctx, playerRef.current, wireRef.current)
  }, !paused)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#000' }}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  )
}
