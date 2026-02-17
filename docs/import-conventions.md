# Import Convention

## Path Rule
- Use `#/*` for all cross-directory imports under `src`.
- Use relative paths only for same-folder local modules (`./*`).

## Order Rule
1. external packages
2. internal aliases (`#/*`)
3. local relative imports (`./*`)

## Example
```ts
import React from "react";

import { useAuth } from "#/providers";
import { Button } from "#/shared/ui";

import { LocalRow } from "./LocalRow";
```
