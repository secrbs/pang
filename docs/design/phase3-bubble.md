# Phase 3 — 버블 동작 세부 구현 계획

> 상위 문서: [PLAN.md](../PLAN.md) · 기능 명세: [FEATURES/game_rule.md](../FEATURES/game_rule.md)

---

## 버블 물리 동작

버블은 중력의 영향을 받아 포물선 운동을 하며, 바닥과 벽에 부딪히면 반사됩니다.

```
초기 상태: 위로 던져진 상태 (vy < 0)

매 프레임:
  vy += 중력
  x  += vx
  y  += vy

바닥 충돌 (y + radius >= FLOOR_Y):
  y = FLOOR_Y - radius
  vy = bounceVy  ← 생성 시 계산된 고유 값 (항상 생성된 높이까지 튀어오름)

벽 충돌 (x - radius <= 0 또는 x + radius >= CANVAS_WIDTH):
  vx = -vx
```

- `vy`는 매 프레임 중력만큼 증가 (아래로 가속)
- 바닥에 닿을 때 `vy`를 `bounceVy`로 초기화 → 항상 **생성(분열)된 높이**까지 튀어오름
- `bounceVy`는 생성 위치 y에서 역산: `-sqrt(2 × GRAVITY × (FLOOR_Y - y - radius))`
- `vx`는 좌우 반사 외에는 변하지 않음

---

## 버블 레벨별 상수

| 레벨 | 반지름 | 수평 속도 (vx) |
|------|--------|---------------|
| Lv.1 | 8      | ±1.5          |
| Lv.2 | 14     | ±1.5          |
| Lv.3 | 22     | ±1.2          |
| Lv.4 | 32     | ±1.0          |
| Lv.5 | 44     | ±0.8          |

- 바운스 높이는 레벨 고정값이 아닌 **생성(분열) 위치에서 동적 계산**
- 레벨이 클수록 느리게 이동, 바운스 높이는 분열 위치에 따라 결정

---

## 분열 로직

```
와이어가 버블에 충돌
  → 해당 버블 제거
  → level > 1: 자식 버블 2개 생성
       좌측 자식: level - 1, vx = -(자식 레벨 vx), vy = 부모의 vy (진행 방향 유지)
       우측 자식: level - 1, vx = +(자식 레벨 vx), vy = 부모의 vy (진행 방향 유지)
       bounceVy = 분열 위치(parent.y) 기준으로 계산 → 바닥 반사 시 분열 높이까지 복귀
  → level === 1: 소멸 (자식 없음)
  → 와이어 소멸 (active = false)
```

---

## 타입 정의

```ts
// src/game/types.ts
export type BubbleLevel = 1 | 2 | 3 | 4 | 5

export type Bubble = {
  id: number       // 고유 식별자 (key용)
  level: BubbleLevel
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  bounceVy: number  // 바닥 반사 속도 (생성 위치 기반으로 결정)
}
```

---

## 컴포넌트 구조

```
GameScene.tsx
  ├─ usePlayer.ts       (기존)
  ├─ useBubbles.ts      (신규) — 버블 배열 상태 및 물리 업데이트
  ├─ useCollision.ts    (신규) — 와이어↔버블 충돌 감지
  └─ <canvas>           — 버블 렌더링 추가
```

---

## 상태

| 상태 | 타입 | 설명 |
|------|------|------|
| `bubbles` | `Bubble[]` | 현재 스테이지의 버블 배열 (`useRef`) |
| `nextId` | `number` | 버블 생성 시 사용할 증가 ID (`useRef`) |

---

## 충돌 감지 (와이어 ↔ 버블)

```
와이어가 active인 경우 매 프레임:
  각 버블에 대해:
    거리 = √((wire.x - bubble.x)² + (wire.y - bubble.y)²)
    거리 <= bubble.radius  →  충돌
```

- 충돌 시 버블 분열 처리 후 와이어 소멸

---

## 렌더링 명세

### 버블
- `arc()` 로 원형 렌더링
- 레벨별 색상:

| 레벨 | 색상 |
|------|------|
| Lv.5 | `#ff4444` |
| Lv.4 | `#ff8800` |
| Lv.3 | `#ffcc00` |
| Lv.2 | `#44ff88` |
| Lv.1 | `#44aaff` |

---

## 구현 순서

1. `src/game/types.ts` 생성 — `Bubble`, `BubbleLevel` 타입 정의
2. `constants.ts`에 `BUBBLE_CONFIG` (레벨별 반지름·속도) 추가
3. `src/game/useBubbles.ts` 생성 — 버블 배열 관리, 물리 업데이트, 분열 로직
4. `src/game/useCollision.ts` 생성 — 와이어↔버블 충돌 감지
5. `GameScene.tsx`에 버블 업데이트·충돌·렌더링 연결
6. Stage 1-1 초기 버블(Lv.4 × 1) 배치로 동작 확인

---

## 완료 기준

- [x] 버블이 화면에 원형으로 표시된다
- [x] 버블이 중력을 받아 포물선으로 움직인다
- [x] 버블이 바닥과 좌우 벽에서 반사된다
- [x] 와이어에 맞으면 더 작은 버블 2개로 분열된다
- [x] Lv.1 버블은 와이어에 맞으면 사라진다
