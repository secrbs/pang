export type BubbleLevel = 1 | 2 | 3 | 4 | 5

export type Bubble = {
  id: number
  level: BubbleLevel
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  bounceVy: number  // 바닥에서 튀어오를 때 사용할 속도 (생성 위치 기반으로 결정)
}
