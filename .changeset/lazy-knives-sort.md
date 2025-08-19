---
"@mfyuu/utils": patch
---

Fix CI workflow and lefthook configuration

- Replace nlx with pnpm exec for consistent local package execution
- Skip lefthook installation in CI environment to prevent hook conflicts
- Update prepare script to use Node.js for Windows compatibility
- Ensure changesets can commit without git hook interference
