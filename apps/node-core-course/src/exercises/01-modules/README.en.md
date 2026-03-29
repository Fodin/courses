# 🔥 Level 1: Node.js Module System

## 🎯 Why Understanding Modules Matters

The module system is the foundation of any Node.js application. Node.js supports **two** module systems: CommonJS (CJS) and ECMAScript Modules (ESM). Understanding both is essential for:

- Proper code organization
- Working with npm packages (some CJS-only, some ESM-only)
- Creating libraries with dual-package support
- Debugging circular dependency issues

## 📌 CommonJS (CJS)

CommonJS was the original Node.js module system, created before ESM was standardized.

### Core APIs

```js
// Export
module.exports = { hello: 'world' }
// or
exports.hello = 'world'

// Import
const mod = require('./module')
const { hello } = require('./module')
const fs = require('fs')
```

### How require() Works

When you call `require('./module')`, Node.js performs 5 steps:

```
require('./module')
  │
  ├── 1. Resolve — determine full file path
  │     ./module → /app/module.js
  │     Search order: .js → .json → .node → index.js in directory
  │
  ├── 2. Check Cache — check require.cache
  │     If already loaded → return cached module.exports
  │
  ├── 3. Load — read file contents
  │     .js  → JavaScript text
  │     .json → JSON.parse()
  │     .node → dlopen() for C++ addons
  │
  ├── 4. Wrap — wrap in a wrapper function
  │     (function(exports, require, module, __filename, __dirname) {
  │       // your module code
  │     })
  │
  └── 5. Execute — run the wrapper and return module.exports
```

### Module Caching

**Each module is loaded and executed only once.** Subsequent `require()` calls return the cached `module.exports`:

```js
// counter.js
let count = 0
module.exports = {
  increment() { return ++count },
  getCount() { return count }
}

// app.js
const a = require('./counter')
const b = require('./counter')
a.increment() // 1
b.getCount()  // 1 — same object!
a === b       // true
```

## 📌 ECMAScript Modules (ESM)

ESM is the standard JavaScript module system from the ES2015 specification.

### Enabling ESM

```json
// package.json — all .js files as ESM
{ "type": "module" }
```

### Key Differences from CommonJS

| Feature | CommonJS | ESM |
|---|---|---|
| Loading | Synchronous | Asynchronous |
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Analysis | Runtime (dynamic) | Parse-time (static) |
| Bindings | Value copies | Live bindings |
| Strict mode | No (default) | Yes (always) |
| Top-level await | No | Yes |
| Tree-shaking | Not possible | Possible (static analysis) |

### Live Bindings

In ESM, imports are **live references** to exported values, not copies:

```js
// counter.mjs
export let count = 0
export function increment() { count++ }

// app.mjs
import { count, increment } from './counter.mjs'
console.log(count) // 0
increment()
console.log(count) // 1 ← updated!
```

## 🔥 Circular Dependencies

Node.js doesn't loop — it returns **partially filled** `module.exports`. This means during circular dependency, you may get `undefined` for properties not yet exported.

### Resolution Strategies

1. **Restructure**: extract shared code into a third module
2. **Lazy require**: move `require()` inside a function
3. **Dependency injection**: pass dependencies as arguments

## 📌 Package.json exports

The `exports` field (Node.js 12.7+) controls what can be imported from your package:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/esm/index.mjs",
      "require": "./dist/cjs/index.cjs",
      "default": "./dist/cjs/index.cjs"
    }
  }
}
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Reassigning exports

```js
// ❌ Bad
exports = { hello: 'world' }
```

```js
// ✅ Good
module.exports = { hello: 'world' }
```

### Mistake 2: require() in ESM

```js
// ❌ require is not defined in ESM
const fs = require('fs')
```

```js
// ✅ Use import
import fs from 'fs'
```

### Mistake 3: Import without extension in ESM

```js
// ❌ Extension required in ESM
import { utils } from './utils'
```

```js
// ✅ Specify extension
import { utils } from './utils.mjs'
```

## 💡 Best Practices

1. **Choose one system** for your project: ESM preferred for new projects
2. **Use `exports` in package.json** for libraries
3. **Avoid circular dependencies** — it's a code smell
4. **Don't clear `require.cache`** without good reason
5. **For dual-package** use conditional exports with `import`/`require`
6. **Always include `"types"`** in conditional exports for TypeScript
