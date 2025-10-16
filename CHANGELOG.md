# @mfyuu/utils

## 0.2.0

### Minor Changes

- [#55](https://github.com/mfyuu/utils/pull/55) [`d3caa60`](https://github.com/mfyuu/utils/commit/d3caa600ebd38440dc722066c66f437e0714d449) Thanks [@mfyuu](https://github.com/mfyuu)! - Add query parameter utility functions for Next.js App Router

  Introduces three utility functions to handle Next.js searchParams:

  - parseAsStr: Extract string values with optional required validation
  - parseAsArr: Extract array values with custom delimiters and flat option
  - parseAsBool: Extract boolean values with strict "true" matching

  All functions support the Next.js searchParams format (string | string[] | undefined) and include comprehensive JSDoc documentation with usage examples.

## 0.1.2

### Patch Changes

- [`2623529`](https://github.com/mfyuu/utils/commit/2623529c79f641ebcd0496440a675af96aa60e5f) Thanks [@mfyuu](https://github.com/mfyuu)! - Fix npm publish configuration for scoped package

  - Add publishConfig with public access to enable npm publishing
  - Resolve E404 error when publishing @mfyuu/utils to npm registry

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
