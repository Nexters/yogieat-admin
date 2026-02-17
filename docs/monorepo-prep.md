# Monorepo Preparation Notes

This repository now includes scaffold packages for future extraction:

- `packages/api-client`
- `packages/domain-types`
- `packages/ui-tokens`
- `packages/eslint-config`
- `packages/tsconfig`

## Current Stage
- Scaffold only (no runtime import cutover yet).
- App remains CRA single-app execution.

## Next Step
1. Extract `shared/config/api-client.ts` into `packages/api-client`.
2. Extract domain DTOs into `packages/domain-types`.
3. Extract style tokens into `packages/ui-tokens`.
4. Replace local configs with `packages/eslint-config` and `packages/tsconfig`.
