# G-One architecture (incremental migration)

The app keeps its current UI, routes, and feature behavior.

- `features/<feature>/domain`: types and repository contracts (no React or HTTP).
- `features/<feature>/application`: use cases / orchestration.
- `features/<feature>/data`: HTTP repositories and session adapters.
- `features/<feature>/presentation`: future ViewModels and screens.
- `shared/api`: HTTP configuration, errors, interceptors.
- `pages`, `components`, `hooks`: existing screens remain unchanged during migration.

The Auth feature is the first migrated vertical slice. Existing `services/authService.ts`
is a compatibility adapter, preserving the login page imports and hash-based navigation.
Other modules currently still use local browser storage; they are NOT production-backed
and must be migrated to server repositories before real multi-user operation.

Do not automatically retry non-idempotent appointment writes. Backend must enforce
tenant authorization, booking idempotency, transactional slot allocation, and pagination.
