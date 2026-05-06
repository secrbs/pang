# Phase 4 — 게임 판정 세부 구현 계획

> 상위 문서: [PLAN.md](../PLAN.md) · 기능 명세: [FEATURES/game_rule.md](../FEATURES/game_rule.md)

---

## 목숨 시스템

| 항목 | 내용 |
|------|------|
| 초기 목숨 | 5개 |
| 사망 조건 | 버블이 플레이어에 닿음 |
| 사망 시 | 목숨 1 감소 → 스테이지 재시작 (GameScene 재마운트) |
| 게임 오버 조건 | 목숨 0 |
| HUD | 캔버스 좌상단 `LIVES ♥♥♥♥♥` 표시 |

---

## 판정 종류

| 판정 | 조건 | 결과 |
|------|------|------|
| 사망 | 버블이 플레이어에 닿음 | 목숨 감소 → 스테이지 재시작 또는 게임 오버 |
| 게임 오버 | 목숨 0 | 게임 오버 화면 표시 |
| 스테이지 클리어 | 버블 배열이 비어있음 | 다음 스테이지로 진행 |

---

## 충돌 감지 — 버블 ↔ 플레이어

플레이어는 사각형, 버블은 원이므로 **AABB-원 충돌** 방식을 사용합니다.

```
플레이어 rect: (player.x, player.y, player.width, player.height)
버블 circle:   center(bubble.x, bubble.y), radius

가장 가까운 점:
  closestX = clamp(bubble.x, player.x, player.x + player.width)
  closestY = clamp(bubble.y, player.y, player.y + player.height)

거리² = (bubble.x - closestX)² + (bubble.y - closestY)²
거리² < radius²  →  충돌
```

---

## 화면 전환 흐름

```
게임 중 (scene = 'game')
  ├─ 버블↔플레이어 충돌
  │    ├─ lives > 1  →  lives-- / stageKey++ (GameScene 재마운트)
  │    └─ lives === 1  →  scene = 'gameover'
  └─ 버블 배열 비어있음  →  onStageClear() → (Phase 5에서 처리)

gameover 화면
  └─ Enter / Space  →  lives = 5 / scene = 'main'
```

---

## 컴포넌트 구조

```
App.tsx
  ├─ GameScene.tsx
  │    └─ useCollision.ts  — 버블↔플레이어 충돌 감지 추가
  └─ GameOverScene.tsx     — 게임 오버 화면 (신규)
```

---

## 상태 변화

| 현재 상태 | 이벤트 | 조건 | 다음 상태 |
|-----------|--------|------|-----------|
| `game` | 버블↔플레이어 충돌 | lives > 1 | `game` (재마운트) |
| `game` | 버블↔플레이어 충돌 | lives === 1 | `gameover` |
| `gameover` | Enter / Space | — | `main` |

---

## GameOverScene 렌더링 명세

```
┌─────────────────────────────────────┐
│                                     │
│          G A M E  O V E R           │  ← 빨간 텍스트
│                                     │
│      [ ENTER ] 메인으로 돌아가기     │  ← 깜빡이는 힌트
│                                     │
└─────────────────────────────────────┘
```

---

## 구현 순서

1. `useCollision.ts`에 버블↔플레이어 충돌 감지 (`checkBubblePlayer`) 추가
2. `GameScene.tsx`에서 충돌 감지 후 `onGameOver` 콜백 호출
3. `GameScene.tsx`에서 버블 소멸 감지 후 `onStageClear` 콜백 호출
4. `GameOverScene.tsx` 생성 — GAME OVER 텍스트, Enter로 메인 복귀
5. `App.tsx`에 `gameover` 씬 연결

---

## 완료 기준

- [x] 버블이 플레이어에 닿으면 목숨이 1 감소하고 스테이지가 재시작된다
- [x] 목숨이 0이 되면 게임 오버 화면이 표시된다
- [x] 게임 오버 화면에서 Enter / Space를 누르면 메인 화면으로 돌아간다
- [x] 모든 버블을 제거하면 스테이지 클리어 콜백이 호출된다
- [x] 캔버스 좌상단에 남은 목숨이 HUD로 표시된다
