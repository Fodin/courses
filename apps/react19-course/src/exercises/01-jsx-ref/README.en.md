# Level 1: New JSX Transform and ref as a Prop

## New JSX Transform

### Background

Before React 17, when you wrote JSX it compiled into `React.createElement()` calls:

```tsx
// Your code
function App() {
  return <div>Hello</div>
}

// Compiled to
function App() {
  return React.createElement('div', null, 'Hello')
}
```

This is why **it was mandatory** to import React in every file that used JSX:

```tsx
import React from 'react' // Required in React 16!
```

### New JSX Transform (React 17+)

Starting with React 17, a new JSX transform was introduced that does not require `React` in scope:

```tsx
// Your code (React 17+)
function App() {
  return <div>Hello</div>
}

// Compiled to
import { jsx as _jsx } from 'react/jsx-runtime'
function App() {
  return _jsx('div', { children: 'Hello' })
}
```

The `jsx-runtime` import is added automatically by the compiler (Babel, TypeScript, SWC).

### In React 19

In React 19, the new JSX transform is **required**. The old transform via `React.createElement` is no longer supported.

**What you need to do:**
1. Remove `import React from 'react'` from files (if React is not used directly)
2. Import only what you need: `import { useState, useEffect } from 'react'`

```tsx
// Before (React 16-18)
import React, { useState } from 'react'

// After (React 19)
import { useState } from 'react'
```

### Configuration in tsconfig.json

Make sure the correct `jsx` value is set in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"  // New transform
    // NOT "jsx": "react" — that is the old transform
  }
}
```

---

## ref as a Regular Prop

### The Problem in React 18

In React 18, to pass a `ref` to a child function component you had to use `forwardRef`:

```tsx
// React 18: forwardRef is required
import { forwardRef, useRef } from 'react'

const FancyInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} {...props} />
})

FancyInput.displayName = 'FancyInput'

// Usage
function Parent() {
  const inputRef = useRef<HTMLInputElement>(null)
  return <FancyInput ref={inputRef} />
}
```

### The Solution in React 19

In React 19, `ref` is a **regular prop**. No `forwardRef` wrapper needed:

```tsx
// React 19: ref as a regular prop
import { type Ref, useRef } from 'react'

function FancyInput({ ref, ...props }: { ref?: Ref<HTMLInputElement> } & InputProps) {
  return <input ref={ref} {...props} />
}

// Usage — exactly the same
function Parent() {
  const inputRef = useRef<HTMLInputElement>(null)
  return <FancyInput ref={inputRef} />
}
```

### Benefits

1. **Less boilerplate** — no need to wrap in `forwardRef`
2. **No `displayName` needed** — named functions already have a name
3. **More readable** — `ref` is just a prop, no magic
4. **Better for TypeScript** — prop types are simpler

---

## ref Cleanup Function

### Old Pattern (React 18)

In React 18, a ref callback was called with `null` when the element was removed from the DOM:

```tsx
// React 18: ref callback
<input
  ref={(node) => {
    if (node) {
      // Element added to the DOM
      node.focus()
    } else {
      // node === null → element removed from the DOM
      console.log('cleanup')
    }
  }}
/>
```

### New Pattern (React 19)

In React 19 you can return a **cleanup function** from a ref callback:

```tsx
// React 19: ref cleanup function
<input
  ref={(node) => {
    // Setup: element added to the DOM
    node.focus()

    const observer = new IntersectionObserver(callback)
    observer.observe(node)

    // Cleanup: called on unmount
    return () => {
      observer.disconnect()
    }
  }}
/>
```

### Benefits of Cleanup Functions

1. **Familiar pattern** — just like `useEffect` cleanup
2. **Node access** — the cleanup function has access to `node` via closure
3. **Cleaner code** — no conditional `if (node) / else` logic

### Usage Examples

```tsx
// Subscribe to IntersectionObserver
<div
  ref={(node) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('Element is visible!')
        }
      })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }}
/>

// Subscribe to ResizeObserver
<div
  ref={(node) => {
    const observer = new ResizeObserver((entries) => {
      console.log('Size changed:', entries[0].contentRect)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }}
/>
```

---

## Migrating from forwardRef

### Step-by-Step Guide

**Step 1:** Remove the `forwardRef` wrapper

```tsx
// Before
const MyInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} {...props} />
})

// After
function MyInput({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

**Step 2:** Remove `displayName` (if used)

```tsx
// Before
MyInput.displayName = 'MyInput'  // Remove this

// After — not needed, the function is already named
```

**Step 3:** Update types (if necessary)

```tsx
// Before
import { forwardRef, Ref } from 'react'

// After
import { type Ref } from 'react'
```

### Codemod for Automated Migration

```bash
npx codemod@latest react/19/replace-forward-ref
```

---

## Additional Resources

- [React 19: ref as a prop](https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop)
- [React 19: ref cleanup functions](https://react.dev/blog/2024/12/05/react-19#ref-cleanup-functions)
- [New JSX Transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)

---

## What's Next?

In the next level you will learn:
- The new `use()` hook for reading promises
- `use(Context)` as a replacement for `useContext`
- Conditional calls to `use()` (unlike other hooks)
- The Suspense + ErrorBoundary + `use()` pattern
