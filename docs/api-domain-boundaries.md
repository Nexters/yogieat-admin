# API Domain Boundaries (Admin)

## Purpose
- Keep page layer dependent on hooks only.
- Keep hooks dependent on domain APIs only.
- Keep `apis/admin` as transport adapter boundary (mock/real switch).

## Layering
1. `pageComponents/*`
2. `hooks/apis/*`
3. `apis/{auth,restaurants,gatherings}/*`
4. `apis/admin/*` (adapter)
5. `shared/config/api-client.ts` (requestJson/ApiError)

## Endpoint Contracts
- `src/apis/auth/contracts.ts`
- `src/apis/restaurants/contracts.ts`
- `src/apis/gatherings/contracts.ts`

## Error Handling
- Network/API errors are normalized by `ApiError` in `shared/config/api-client.ts`.
- UI-friendly messages are mapped via `shared/utils/getErrorMessage.ts`.

## Migration Direction
- Move shared API client to `packages/api-client`.
- Move DTO types to `packages/domain-types`.
- Keep feature hooks stable during migration.
