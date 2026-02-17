# Yogieat Admin

CRA(TypeScript) + pnpm + Radix UI 기반의 Admin 대시보드 초기 템플릿입니다.

## Runtime

- Node: `20` (`.nvmrc`)
- pnpm: `10.x`

## Quick Start

```bash
pnpm install
pnpm start
```

- App URL: [http://localhost:3000](http://localhost:3000)

## API Environment

- CRA에서는 클라이언트 환경 변수를 `REACT_APP_*` 규칙으로 사용합니다.
- 이 프로젝트는 `yogieat`와 동일하게 `REACT_APP_API_URL`을 기본 도메인으로 받고,
  내부 API base를 `${REACT_APP_API_URL}/api/v1`로 조합합니다.
- Admin API prefix는 `REACT_APP_ADMIN_API_PREFIX`로 제어하며 기본값은 `/api/v1/admin`입니다.
- Admin API는 `mock`/`real` 모드 전환이 가능합니다.
  - `REACT_APP_USE_MOCK_API=true`: 프론트 로컬 목 서비스 사용(네트워크 API 호출 없음, 기본값)
  - `REACT_APP_USE_MOCK_API=false`: 실제 백엔드 API 호출

### Local setup

1. `.env.example`을 참고해 `.env.local` 파일을 생성합니다.
2. 개발 환경에서는 아래 값을 사용합니다.

```bash
REACT_APP_API_URL=https://dev-api.yogieat.com
REACT_APP_ADMIN_API_PREFIX=/api/v1/admin
REACT_APP_USE_MOCK_API=true
```

### Production setup

- 배포 환경(CI/CD 또는 호스팅 플랫폼)에 아래 값을 주입합니다.

```bash
REACT_APP_API_URL=https://api.yogieat.com
REACT_APP_ADMIN_API_PREFIX=/api/v1/admin
REACT_APP_USE_MOCK_API=false
```

주의:
- CRA 환경 변수는 **빌드 타임 주입**이므로 런타임에 변경되지 않습니다.
- 환경 값 변경 후에는 재빌드가 필요합니다.

### Admin API path convention

- 로그인: `POST /api/v1/admin/auth/login`
- 로그아웃: `POST /api/v1/admin/auth/logout`
- 카테고리: `GET /api/v1/admin/sdui/categories`
- 모임 목록: `GET /api/v1/admin/gatherings`
- 모임 상세: `GET /api/v1/admin/gatherings/{id}`
- 모임/참여자 대시보드: `GET /api/v1/admin/gatherings/dashboard`
- 맛집 목록: `GET /api/v1/admin/restaurants`
- 맛집 상세/수정: `GET|PUT /api/v1/admin/restaurants/{id}`
- 단일/전체 동기화: `POST /api/v1/admin/restaurants/{id}/sync`, `POST /api/v1/admin/restaurants/sync`

## Scripts

- `pnpm start`: 개발 서버 실행
- `pnpm test`: 테스트 실행 (watch)
- `pnpm build`: 프로덕션 빌드
- `pnpm lint`: ESLint 검사
- `pnpm lint:fix`: ESLint 자동 수정
- `pnpm format`: Prettier 포맷 적용
- `pnpm format:check`: Prettier 포맷 검사

## Project Structure

```text
src/
  app/
  apis/
  hooks/
  pageComponents/
    auth/
    common/
    restaurants/
    gatherings/
    design-system/
  providers/
  shared/
    ui/
      primitives/
      composites/
    styles/
    config/
packages/
  api-client/
  domain-types/
  ui-tokens/
  eslint-config/
  tsconfig/
```

## Import Alias

- `#/* -> src/*` alias를 사용합니다.
- CRA 환경에서는 `craco`로 webpack/jest alias를 설정했습니다.
- import 순서는 `external -> #/* -> local(./*)` 규칙을 따릅니다.

## Design System Entry

- 토큰 파일: `src/shared/styles/tokens.css`
- 전역 스타일: `src/shared/styles/globals.css`
- Radix wrapper: `src/shared/ui/primitives/*`

## Asset Rule (Deploy-safe)

- `http://localhost:3845/assets/...` URL은 Figma Desktop MCP 로컬 세션 전용이므로 배포 환경에서 동작하지 않습니다.
- 프로덕션에서는 반드시 다음 중 하나로 사용하세요.
  - `public/` 정적 파일 경로 (예: `/images/...`, `/assets/...`)
  - 코드 내 SVG(컴포넌트/inline)
  - CDN URL
- 현재 코드베이스는 `localhost:3845` 참조를 제거했고, 배포 가능한 정적 경로로 변환되어 있습니다.

## Architecture Reference

- `yogieat` 분석 및 admin 적용 가이드:
  - `docs/yogieat-architecture-reference.md`

## Figma MCP (OAuth, Remote)

1. 서버 등록

```bash
codex mcp add figma --url https://mcp.figma.com/mcp
```

2. OAuth 로그인

```bash
codex mcp login figma --scopes file_content
```

3. 상태 확인

```bash
codex mcp list
codex mcp get figma --json
```

4. 로그인 재수행(세션 만료/권한 변경 시)

```bash
codex mcp logout figma
codex mcp login figma --scopes file_content
```

## Figma MCP (Desktop SSE, Remote 병행)

기존 `figma`(remote)는 유지하고, 로컬 Figma Desktop MCP를 `figma-desktop`으로 추가합니다.

1. Desktop 엔드포인트 확인

```bash
curl -i http://127.0.0.1:3845/mcp
```

2. Codex에 Desktop 서버 추가

```bash
codex mcp add figma-desktop --url http://127.0.0.1:3845/mcp
```

3. 상태 확인

```bash
codex mcp list
codex mcp get figma-desktop --json
```

4. Other editors 수동 설정(SSE/Streamable HTTP 지원 에디터)

```json
{
  "mcpServers": {
    "Figma Desktop": {
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

주의:
- 에디터 문서에서 SSE(Server-Sent Events) 또는 Streamable HTTP MCP를 지원하는지 먼저 확인하세요.
- 에디터별로 transport 이름이 `sse` 또는 `streamable_http`로 다를 수 있습니다.

## Troubleshooting

- `ENOTFOUND registry.npmjs.org`: 네트워크/권한 문제입니다. 네트워크가 허용된 셸에서 `pnpm install`을 다시 실행하세요.
- `Node version issue`: `node -v`가 `20.x`가 아니면 `nvm use` 등으로 Node 20을 활성화하세요.
- Figma `unauthorized`/`forbidden`: Figma 로그인 계정 권한과 파일 공유 권한을 확인하고 `codex mcp login figma --scopes file_content`를 다시 실행하세요.
- OAuth 브라우저 콜백 실패: 브라우저 팝업 차단 해제 후 재시도하거나 다른 기본 브라우저로 시도하세요.
- `curl http://127.0.0.1:3845/mcp` 연결 실패: Figma Desktop 재시작, Dev Mode MCP 옵션 활성화, 포트 사용 여부(`lsof -i :3845`)를 확인하세요.
