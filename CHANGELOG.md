# @mfyuu/utils

## 0.1.1

### Patch Changes

- [#2](https://github.com/mfyuu/utils/pull/2) [`1bbb2f1`](https://github.com/mfyuu/utils/commit/1bbb2f1dbb1bcc0cd93087bf34d5d29de14df605) Thanks [@mfyuu](https://github.com/mfyuu)! - Fix CI workflow and lefthook configuration

  - Replace nlx with pnpm exec for consistent local package execution
  - Skip lefthook installation in CI environment to prevent hook conflicts
  - Update prepare script to use Node.js for Windows compatibility
  - Ensure changesets can commit without git hook interference

- [#1](https://github.com/mfyuu/utils/pull/1) [`6863d6b`](https://github.com/mfyuu/utils/commit/6863d6b699b30399db7f37980b137b764585be19) Thanks [@mfyuu](https://github.com/mfyuu)! - Update documentation and optimize scripts

  - Add installation section to README
  - Add credits section acknowledging @antfu/utils
  - Optimize package.json scripts to use 'nr' shorthand

## 0.1.0

### Minor Changes

- Initial release of @mfyuu/utils

  - Type guard utilities (isString, isNumber, isObject, isArray, isFunction, isBoolean, isUndefined, isNull, isNullish, isDefined)
  - Full TypeScript support with strict type checking
  - ESM module with unbuild
