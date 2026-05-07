import type { BubbleLevel } from './types'
import { FLOOR_Y } from './constants'

export type WallData = {
  x: number
  y: number
  width: number
  height: number
}

export type StageData = {
  bubbles: { level: BubbleLevel; x: number; y: number }[]
  walls: WallData[]
}

const WALL_Y = FLOOR_Y - 170
const WALL_W = 120
const WALL_H = 20

export const MISSION1_STAGES: StageData[] = [
  {
    // Stage 1-1 (낮)
    bubbles: [{ level: 4, x: 300, y: 100 }],
    walls: [],
  },
  {
    // Stage 1-2 (저녁)
    bubbles: [
      { level: 4, x: 150, y: 100 },
      { level: 3, x: 580, y: 150 },
    ],
    walls: [
      { x: 100, y: WALL_Y, width: WALL_W, height: WALL_H },
      { x: 580, y: WALL_Y, width: WALL_W, height: WALL_H },
    ],
  },
  {
    // Stage 1-3 (밤)
    bubbles: [
      { level: 5, x: 100, y: 80  },
      { level: 3, x: 580, y: 200 },
    ],
    walls: [
      { x: 80,  y: WALL_Y, width: WALL_W, height: WALL_H },
      { x: 340, y: WALL_Y, width: WALL_W, height: WALL_H },
      { x: 580, y: WALL_Y, width: WALL_W, height: WALL_H },
    ],
  },
]
