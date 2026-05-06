# Phase 1 — 메인 화면 세부 구현 계획

> 상위 문서: [PLAN.md](../PLAN.md) · 기능 명세: [FEATURES/main.md](../FEATURES/main.md)

---

## 화면 구성

```
┌─────────────────────────────────────┐
│                                     │
│           P A N G                   │  ← 타이틀
│                                     │
│         [ GAME START ]              │  ← 선택된 항목 (강조)
│         [ HOW TO PLAY ]             │
│                                     │
└─────────────────────────────────────┘
```

---

## 컴포넌트 구조

```
App.tsx
  └─ MainScene.tsx
       ├─ TitleLogo          # "P A N G" 텍스트
       └─ MenuList
            ├─ MenuItem      # GAME START
            └─ MenuItem      # HOW TO PLAY
```

---

## 상태

| 상태 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| `scene` | `'main' \| 'howtoplay' \| 'game' \| 'pause' \| 'gameover'` | `'main'` | App 전체 씬 |
| `cursor` | `0 \| 1` | `0` | 현재 선택된 메뉴 인덱스 |

---

## 입력 처리

| 키 | 동작 |
|----|------|
| `ArrowUp` | cursor를 위 항목으로 이동 (0에서 위 누르면 1로 순환) |
| `ArrowDown` | cursor를 아래 항목으로 이동 (1에서 아래 누르면 0으로 순환) |
| `Enter` / `Space` | cursor === 0 → scene을 `'game'`으로 전환 |
| `Enter` / `Space` | cursor === 1 → scene을 `'howtoplay'`로 전환 |

### HOW TO PLAY 화면

- 조작 방법(방향키: 이동 / 스페이스: 와이어 발사)과 목표(모든 버블 제거) 안내
- Enter / Space 입력 시 메인 화면으로 복귀

---

## 렌더링 명세

### 타이틀
- 텍스트: `P A N G`
- 위치: 캔버스 수평 중앙, 상단 1/3 지점

### 메뉴 항목
- `GAME START`, `HOW TO PLAY` 두 항목을 세로로 나열
- 선택된 항목: 텍스트 앞에 `▶` 표시 또는 색상 강조
- 비선택 항목: 일반 색상

---

## 화면 전환 조건

```
cursor === 0 + Enter/Space  →  scene = 'game'
cursor === 1 + Enter/Space  →  scene = 'howtoplay'
howtoplay에서 Enter/Space   →  scene = 'main'

game 중 ESC               →  scene = 'pause' (게임 일시 정지)
pause에서 YES              →  scene = 'main'
pause에서 NO               →  scene = 'game' (재개)
```

---

## 구현 순서

1. `App.tsx`에 `scene` 상태 추가, 씬별 컴포넌트 조건부 렌더링
2. `MainScene.tsx` 생성 — 타이틀 · 메뉴 렌더링
3. `cursor` 상태 및 키보드 이벤트 연결
4. Enter/Space 입력 시 `scene → 'game'` 전환 연결
5. `HowToPlayScene.tsx` 생성 — 조작 안내 텍스트 표시
6. Enter/Space 입력 시 `scene → 'main'` 복귀 연결
7. 게임 화면에서 ESC 입력 시 `scene → 'pause'` 전환
8. `PauseOverlay.tsx` 생성 — "메인으로 돌아가시겠습니까? YES / NO" 표시, YES/NO 선택 처리

---

## 완료 기준

- [x] 실행 시 메인 화면이 표시된다
- [x] 방향키로 메뉴 항목 간 커서가 이동한다
- [x] GAME START에서 Enter/Space를 누르면 게임 화면으로 전환된다
- [x] HOW TO PLAY에서 Enter/Space를 누르면 조작 안내 화면이 표시된다
- [x] 조작 안내 화면에서 Enter/Space를 누르면 메인 화면으로 돌아온다
- [x] 게임 중 ESC를 누르면 게임이 정지되고 확인 메시지가 표시된다
- [x] 확인 메시지에서 YES 선택 시 메인 화면으로 돌아간다
- [x] 확인 메시지에서 NO 선택 시 게임이 재개된다
