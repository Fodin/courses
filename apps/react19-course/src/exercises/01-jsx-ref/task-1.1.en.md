# Task 1.1: JSX Without import React

## Objective

Remove the unnecessary `import React from 'react'` from a component, taking advantage of the new JSX transform.

## Requirements

1. Open the task file — it contains `import React from 'react'`
2. Make sure the component uses JSX (returns a `<div>`)
3. Delete the line `import React from 'react'`
4. Verify that the component still works correctly
5. If you need `useState` or another hook — import it directly:
   ```tsx
   import { useState } from 'react'
   ```

## Explanation

The new JSX transform (introduced in React 17, required in React 19) automatically adds an import from `react/jsx-runtime`. You no longer need to import `React` to use JSX.

## Checklist

- [ ] `import React from 'react'` has been removed
- [ ] The component works without errors
- [ ] If hooks are used — they are imported directly
- [ ] `"jsx": "react-jsx"` is set in `tsconfig.json`
