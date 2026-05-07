import { useCallback, useLayoutEffect, useRef } from 'react'
import { useGameLoop } from '../game/useGameLoop'
import { usePlayer, type Player, type Wire } from '../game/usePlayer'
import { useBubbles } from '../game/useBubbles'
import { useCollision } from '../game/useCollision'
import { CANVAS_WIDTH, CANVAS_HEIGHT, FLOOR_Y, BUBBLE_CONFIG } from '../game/constants'
import type { Bubble } from '../game/types'
import type { StageData, WallData } from '../game/stageData'

interface Props {
  stageData: StageData
  lives: number
  cheat: boolean
  paused: boolean
  onPlayerDead: () => void
  onStageClear: () => void
}

const INVINCIBLE_FRAMES = 120

function drawBubble(ctx: CanvasRenderingContext2D, bubble: Bubble) {
  ctx.beginPath()
  ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
  ctx.fillStyle = BUBBLE_CONFIG[bubble.level].color
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawWall(ctx: CanvasRenderingContext2D, wall: WallData) {
  ctx.fillStyle = '#888'
  ctx.fillRect(wall.x, wall.y, wall.width, wall.height)
  ctx.fillStyle = '#aaa'
  ctx.fillRect(wall.x, wall.y, wall.width, 4)
}

function drawHUD(ctx: CanvasRenderingContext2D, lives: number, cheat: boolean) {
  ctx.font = 'bold 18px "Courier New"'
  ctx.fillStyle = '#fff'
  ctx.fillText('LIVES', 12, 26)
  for (let i = 0; i < lives; i++) {
    ctx.fillStyle = '#ff4444'
    ctx.fillText('♥', 76 + i * 22, 26)
  }
  if (cheat) {
    ctx.fillStyle = '#ffff00'
    ctx.fillText('CHEAT', CANVAS_WIDTH - 80, 26)
  }
}

function draw(
  ctx: CanvasRenderingContext2D,
  player: Player,
  wire: Wire,
  bubbles: Bubble[],
  walls: WallData[],
  lives: number,
  cheat: boolean,
  invincible: number,
) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  ctx.fillStyle = '#444'
  ctx.fillRect(0, FLOOR_Y, CANVAS_WIDTH, CANVAS_HEIGHT - FLOOR_Y)

  for (const wall of walls) drawWall(ctx, wall)
  for (const bubble of bubbles) drawBubble(ctx, bubble)

  if (wire.active) {
    ctx.strokeStyle = cheat ? '#ffff00' : '#fff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(wire.x, wire.bottomY)
    ctx.lineTo(wire.x, wire.y)
    ctx.stroke()
  }

  const showPlayer = invincible === 0 || Math.floor(invincible / 6) % 2 === 0
  if (showPlayer) {
    ctx.fillStyle = cheat ? '#ffff00' : '#00ccff'
    ctx.fillRect(player.x, player.y, player.width, player.height)
  }

  drawHUD(ctx, lives, cheat)
}

export default function GameScene({ stageData, lives, cheat, paused, onPlayerDead, onStageClear }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const invincibleRef = useRef(0)
  const cheatRef = useRef(cheat)
  const stageClearedRef = useRef(false)

  useLayoutEffect(() => {
    cheatRef.current = cheat
  }, [cheat])

  const { playerRef, wireRef, update: updatePlayer } = usePlayer(paused, stageData.walls)
  const { bubblesRef, updatePhysics, splitBubble, killBubble } = useBubbles(stageData.bubbles, stageData.walls)

  const hitBubble = useCallback((id: number) => {
    if (cheatRef.current) killBubble(id)
    else splitBubble(id)
  }, [killBubble, splitBubble])

  const { checkWireBubble, checkBubblePlayer } = useCollision(bubblesRef, wireRef, playerRef, hitBubble)

  useGameLoop(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    updatePlayer()
    updatePhysics()
    checkWireBubble()

    if (!cheatRef.current) {
      if (invincibleRef.current > 0) {
        invincibleRef.current--
      } else if (checkBubblePlayer()) {
        invincibleRef.current = INVINCIBLE_FRAMES
        onPlayerDead()
      }
    }

    if (!stageClearedRef.current && bubblesRef.current.length === 0) {
      stageClearedRef.current = true
      onStageClear()
      return
    }

    draw(ctx, playerRef.current, wireRef.current, bubblesRef.current, stageData.walls, lives, cheatRef.current, invincibleRef.current)
  }, !paused)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#000' }}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  )
}
