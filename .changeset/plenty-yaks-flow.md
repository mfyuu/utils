---
"@mfyuu/utils": minor
---

Add query parameter utility functions for Next.js App Router

Introduces three utility functions to handle Next.js searchParams:

- parseAsStr: Extract string values with optional required validation
- parseAsArr: Extract array values with custom delimiters and flat option
- parseAsBool: Extract boolean values with strict "true" matching

All functions support the Next.js searchParams format (string | string[] | undefined) and include comprehensive JSDoc documentation with usage examples.
