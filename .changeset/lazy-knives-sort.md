---
"@mfyuu/utils": patch
---

Fix CI workflow and lefthook configuration

- Replace nlx with pnpm exec for consistent local package execution
- Skip lefthook installation in CI environment to prevent hook conflicts
- Ensure changesets can commit without git hook interference
