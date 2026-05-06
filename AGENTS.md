# AGENTS.md

AI 에이전트(Claude Code 등)가 이 프로젝트에서 작업할 때 참고할 문서 인덱스 및 작업 가이드입니다.

---

## 문서 구조

```
docs/
├── PRD.md                     # 게임 전체 요구사항 (원작 분석 기반)
├── PLAN.md                    # Phase별 구현 계획 (고객 확인 기준)
├── FEATURES/
│   ├── main.md                # 메인 화면 구성 및 UI 흐름
│   ├── game_rule.md           # 게임 룰 상세 (버블 메커니즘, 게임 오버 등)
│   └── mission1.md            # Mission 1 스테이지별 난이도 및 규칙
└── design/
    ├── phase1-main-screen.md  # Phase 1 메인 화면 세부 구현 설계
    ├── phase2-player.md       # Phase 2 플레이어 조작 세부 구현 설계
    ├── phase3-bubble.md       # Phase 3 버블 동작 세부 구현 설계
    └── phase4-judgment.md     # Phase 4 게임 판정 세부 구현 설계
```

---

## 각 문서 요약

### `docs/PRD.md`
PANG 원작을 기반으로 한 전체 게임 요구사항.
- 핵심 게임플레이, 공 분열 메커니즘, Mission 1 전반 구성 정의
- 무기 명칭: **와이어**, 플레이어: **1인**
- 공 크기: **5단계** (Lv.5 → Lv.1)

### `docs/FEATURES/main.md`
게임 시작 시 표시되는 메인 화면 구성.
- 타이틀, 메뉴(GAME START / HOW TO PLAY) 표시
- 화면 전환 흐름 포함

### `docs/FEATURES/game_rule.md`
게임 전반에 걸쳐 적용되는 룰 상세.
- 플레이어 이동 (좌우 / 점프 불가)
- 와이어 발사 규칙 (동시 1개, 항상 위쪽, 벽 통과 불가)
- 공 분열 테이블, 게임 오버 조건 (사망 시 즉시 게임 오버)
- **시간 제한·점수 없음**

### `docs/FEATURES/mission1.md`
Mission 1 스테이지별 세부 규칙.
- Stage 1-1 (낮): Lv.4 × 1 / Stage 1-2 (저녁): Lv.4 × 1 + Lv.3 × 1 / Stage 1-3 (밤): Lv.5 × 1 + Lv.3 × 1
- 각 스테이지 지형, 공 분열 시나리오
- **시간 제한·파워업 없음**

---

### `docs/PLAN.md`
Phase별 구현 계획 — 고객 관점의 확인 항목 중심.
- Phase 1(메인화면) → 2(플레이어조작) → 3(버블동작) → 4(게임판정) → 5(스테이지구성)

### `docs/design/phase1-main-screen.md`
Phase 1 메인 화면의 세부 구현 설계.
- 컴포넌트 구조, 상태 정의, 키 입력 처리, 렌더링 명세, 구현 순서

---

## 구현 시 참고 사항

- 모든 기능 구현 전 해당 FEATURES 문서를 먼저 확인할 것
- PRD와 FEATURES 문서가 충돌할 경우 **FEATURES 문서를 우선** 적용
- **시간, 점수, 생명, 파워업 개념 없음** — 사망 시 바로 게임 오버
- 지형은 Mission 1에서 **벽(플랫폼)만** 사용 (사다리 없음)
