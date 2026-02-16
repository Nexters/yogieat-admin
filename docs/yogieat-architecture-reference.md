# Yogieat 아키텍처 분석 및 Admin 적용 가이드

## 1) `../yogieat`에서 확인한 핵심 구조

- 엔트리 레이어 분리
	- `app/*`: 라우팅/레이아웃
	- `src/*`: 도메인 로직과 UI 구성
- 기능별 수평 레이어
	- `apis`, `hooks`, `providers`, `constants`, `utils`, `pageComponents`, `components`
- Provider 경계 명확화
	- 라우트 레이아웃에서 `QueryProvider` 주입
- 디자인 토큰 중심 스타일
	- `app/globals.css`에서 토큰 파일들(`src/styles/*`)을 모아서 import
- 코드 스타일 통일
	- Prettier 단일 규칙 + ESLint에 Prettier 규칙 연동

## 2) Admin에 적용한 항목

- 레이어 스캐폴딩 추가
	- `src/apis`
	- `src/hooks`
	- `src/providers`
	- `src/constants`
	- `src/utils`
- Provider 경계 도입
	- `src/providers/AppProviders.tsx`
	- `src/app/App.tsx`에서 페이지를 `AppProviders`로 래핑
- 기존 토큰 스타일 전략 유지
	- `src/shared/styles/tokens.css` + `src/shared/styles/globals.css`

## 3) ESLint/Prettier 차용 내용

- `prettier.config.mjs` 추가
	- `useTabs: true`
	- `tabWidth: 4`
	- `trailingComma: "all"`
	- `semi: true`
	- `singleQuote: false`
- `.prettierignore` 추가
- `package.json`에 스크립트 추가
	- `lint`, `lint:fix`, `format`, `format:check`
- `eslintConfig`에 `plugin:prettier/recommended` 확장 추가

## 4) Admin 기준 권장 아키텍처 규칙

- `pages`: 화면 컴포지션(도메인 흐름)
- `features`: 사용자 액션 단위 로직
- `widgets`: 재사용 가능한 화면 블록
- `shared/ui/primitives`: Radix primitive 래퍼
- `apis/hooks/providers/constants/utils`: 도메인 공통 기반

## 5) 다음 확장 순서

1. `apis/*`에 admin API 클라이언트 모듈 추가
2. `hooks/*`에 화면별 데이터 접근 훅 분리
3. `providers/AppProviders`에 QueryClient/Toast/Theme 순서로 주입
4. 피그마 토큰을 `tokens.css`로 매핑하고 primitive에 연결
