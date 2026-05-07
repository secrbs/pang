# Phase 5 — 스테이지 구성 세부 구현 계획

> 상위 문서: [PLAN.md](../PLAN.md) · 기능 명세: [FEATURES/mission1.md](../FEATURES/mission1.md)

---

## 스테이지 데이터 구조

```ts
// src/game/stageData.ts
type StageData = {
  bubbles: { level: BubbleLevel; x: number; y: number }[]
  walls:   { x: number; y: number; width: number; height: number }[]
}
```

---

## Mission 1 스테이지 정의

### Stage 1-1 (낮)

- 버블: Lv.4 × 1
- 벽: 없음

```
┌────────────────────────────────────────┐
│                                        │
│         ● (Lv.4, x=300, y=100)        │
│                                        │
│                                        │
│────────────────────────────────────────│ ← FLOOR_Y
└────────────────────────────────────────┘
```

### Stage 1-2 (저녁)

- 버블: Lv.4 × 1, Lv.3 × 1
- 벽: 좌(x=100), 우(x=580) 각 120×20

```
┌────────────────────────────────────────┐
│  ● (Lv.4, x=150, y=100)               │
│                    ● (Lv.3, x=580,y=150)│
│  [══════]               [══════]       │ ← 벽
│────────────────────────────────────────│
└────────────────────────────────────────┘
```

### Stage 1-3 (밤)

- 버블: Lv.5 × 1, Lv.3 × 1
- 벽: 좌(x=80), 중앙(x=340), 우(x=580) 각 120×20

```
┌────────────────────────────────────────┐
│ ● (Lv.5, x=100, y=80)                 │
│                    ● (Lv.3, x=580,y=200)│
│ [══════]  [══════]  [══════]           │ ← 벽 3개
│────────────────────────────────────────│
└────────────────────────────────────────┘
```

---

## 벽(플랫폼) 동작

- 버블이 벽 위에서 반사: 버블 하단이 벽 상단에 닿으면 `vy = bounceVy`
- 플레이어는 벽 위를 걸을 수 있음 (현재 Phase 5에서는 미구현 — 플레이어는 바닥만 이동)
- 와이어는 벽을 통과하지 못함: 와이어 `y`가 벽 상단에 닿으면 소멸

---

## 스테이지 진행 흐름

```
App.tsx
  stageIndex: 0 → 1 → 2

GameScene
  현재 stageIndex의 StageData로 초기화

StageClearScene
  onNext() → stageIndex + 1
    stageIndex < 3  → scene = 'game' (다음 스테이지)
    stageIndex >= 3 → scene = 'missionclear'

MissionClearScene (신규)
  "MISSION CLEAR" 표시
  Enter → scene = 'main'
```

---

## 컴포넌트 구조

```
App.tsx
  ├─ stageIndex: number (0~2)
  ├─ GameScene
  │    └─ stageData: MISSION1_STAGES[stageIndex]
  ├─ StageClearScene  →  onNext: stageIndex 증가 또는 missionclear
  └─ MissionClearScene (신규)
```

---

## 구현 순서

1. `src/game/stageData.ts` 생성 — `MISSION1_STAGES` 배열 정의
2. `GameScene.tsx`에 `stageData` prop 추가, 버블·벽 초기화에 사용
3. 버블의 벽 반사 처리 (`useBubbles.ts` 업데이트)
4. 와이어의 벽 충돌 처리 (`usePlayer.ts` 업데이트)
5. `App.tsx`에 `stageIndex` 상태 추가, 스테이지 순차 진행 연결
6. `MissionClearScene.tsx` 생성
7. 벽 렌더링 추가 (`GameScene.tsx`)

---

## 완료 기준

- [x] Stage 1-1, 1-2, 1-3이 순서대로 진행된다
- [x] 각 스테이지의 버블 구성이 문서와 일치한다
- [x] Stage 1-2, 1-3에서 벽이 화면에 표시된다
- [x] 버블이 벽 위에서 반사된다
- [x] 와이어가 벽에 닿으면 소멸된다
- [x] Stage 1-3 클리어 시 Mission Clear 화면이 표시된다
