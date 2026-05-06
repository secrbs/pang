# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # 개발 서버 실행 (http://localhost:5173)
npm run build     # 프로덕션 빌드 (tsc -b && vite build)
npm run lint      # ESLint 검사
npm run preview   # 빌드 결과물 미리보기
```

> **주의:** `npm run dev` 실행 시 `.vs` 폴더(Visual Studio 잠금 파일)를 Vite 파일 감시 대상에서 제외하도록 `vite.config.ts`에 설정되어 있음. 해당 설정을 제거하면 `EBUSY` 에러 발생.

## Architecture

진입점: `index.html` → `src/main.tsx` → `src/App.tsx`

- `src/main.tsx`: React 앱을 `#root` DOM 요소에 마운트 (StrictMode 적용)
- `src/App.tsx`: 최상위 컴포넌트. 현재 화면 중앙에 "Hello World" 표시
- `src/index.css`: 전역 스타일

## TypeScript 설정

- `tsconfig.json`: `tsconfig.app.json`과 `tsconfig.node.json`을 참조하는 루트 설정
- `tsconfig.app.json`: `src/` 대상, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` 활성화
- 모듈 해석 방식: bundler 모드 (`allowImportingTsExtensions` 허용)

## ESLint

`eslint.config.js`는 flat config 방식으로, `.ts`/`.tsx` 파일에 다음 규칙 적용:
- `@typescript-eslint/recommended`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`

## 게임 기획 문서

기능 구현 전 아래 문서를 먼저 확인할 것. PRD와 FEATURES 문서가 충돌할 경우 **FEATURES 문서를 우선** 적용.

- [PRD](docs/PRD.md) — 게임 전체 요구사항 및 공 분열 메커니즘
- [메인 화면](docs/FEATURES/main.md) — 타이틀·메뉴 구성 및 화면 전환 흐름
- [게임 룰](docs/FEATURES/game_rule.md) — 플레이어 조작, 와이어, 공 동작, 게임 오버 조건
- [Mission 1](docs/FEATURES/mission1.md) — 스테이지별 공 구성·지형·난이도
- [구현 계획](docs/PLAN.md) — Phase별 작업 목록, 파일 구조, 기술 결정

> 시간 제한·점수·생명·파워업 개념 없음. 사망 시 즉시 게임 오버.
