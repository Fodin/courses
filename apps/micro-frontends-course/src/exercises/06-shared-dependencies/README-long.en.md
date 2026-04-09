# Level 6: Shared Dependencies — Extended Theory

## Why Dependency Duplication is a Catastrophe

### Two React Runtimes = Broken Context

React Context works through a closure on the React instance. If Shell creates an `AuthContext` with React v1, and Cart tries to read it through its own React v2 — the context simply won't be found. `useContext` will return `undefined`.

```
❌ Without sharing:

Shell (React instance A)
  └── AuthContext.Provider value={user}

Cart (React instance B)
  └── useContext(AuthContext)  ← context from instance A, read by instance B
       → undefined             ← fail
```

This is not a hypothetical scenario — it's a real error that every microfrontend developer encounters at least once.

### The Hooks Problem

React hooks work through a global hook dispatcher stored in the React instance. With two copies of React you'll get "Invalid hook call" — the most puzzling error for those unaware of duplication.

### Bundle Size

For 4 MFEs with React + react-dom + router:

```
Without sharing:  (45 + 130 + 52) × 4 = 908 KB
With sharing:     (45 + 130 + 52) × 1 = 227 KB

Saving: 681 KB (75%)
```

And that's just three libraries. With a full design system, savings can reach megabytes.

## Import Maps in Detail

### Specification and Support

Import Maps are part of the HTML specification (WHATWG). Natively supported:
- Chrome 89+ (March 2021)
- Firefox 108+ (December 2022)
- Safari 16.4+ (March 2023)

For older browsers: [es-module-shims](https://github.com/guybedford/es-module-shims) — a polyfill that parses and implements import maps in unsupported browsers.

### Resolution Algorithm

```
import 'react' → Is it in importmap?
  → Yes → Load by URL from imports
  → No → Is there a matching scope?
    → Yes → Load by URL from scope
    → No → Error: bare specifier not resolved
  → Browser cache applies to all
```

### Import Map Generators

Manual maintenance of import maps becomes inconvenient with many dependencies. Generators exist:

- **[ImportMap.dev](https://generator.jspm.io/)** — visual generator from JSPM
- **[jspm CLI](https://jspm.org/getting-started)** — `jspm install react react-dom`
- **[import-map-deployer](https://github.com/single-spa/import-map-deployer)** — server for dynamic import map updates at runtime (from single-spa)

`import-map-deployer` allows updating import map via API without redeploying the shell:

```bash
# Deploy new version of Catalog MFE
PATCH /import-map.json
{
  "imports": {
    "@company/mfe-catalog": "https://cdn.company.com/catalog/v2.3.1/main.js"
  }
}
```

## Module Federation Shared — Complete Guide

### Automatic Shared Detection

MF 2.x can automatically detect shared from package.json:

```js
const { dependencies } = require('./package.json')

new ModuleFederationPlugin({
  shared: {
    ...dependencies, // all dependencies — shared with current version
    react: { singleton: true, eager: true, requiredVersion: dependencies.react },
    'react-dom': { singleton: true, eager: true, requiredVersion: dependencies['react-dom'] },
  }
})
```

⚠️ Caution: sharing absolutely all dependencies is a bad idea. Too much runtime negotiation slows initialization.

### Version Negotiation at Runtime

When multiple MFEs declare the same library with different versions, MF conducts "negotiation":

```
Shell:   react singleton ^18.0.0, loaded 18.3.0
Catalog: react singleton ^18.0.0, loaded 18.2.0
Cart:    react singleton ^18.0.0, loaded 18.3.0

Result: 18.3.0 loads (maximum compatible)
```

If Cart declares `^17.0.0` — singleton conflict, warning goes to console, and two copies may load.

### eager and async boundary

```
❌ Problem:
index.js → import './App' (static)
         → App uses shared React
         → React not yet loaded → error

✅ Solution:
index.js → import('./bootstrap') (dynamic)
bootstrap.js → import './App'   (static)
```

This is called "async boundary" — a boundary after which MF has time to negotiate versions and load shared modules.

## Shared Strategy: Architectural Decisions

### What to Definitely Share

```
1. React, React DOM
   Reason: singleton required, otherwise context and hooks break

2. Router (react-router, vue-router)
   Reason: single navigation history, single location

3. Design System / UI Kit
   Reason: visual consistency, avoid duplication

4. State manager (if using global)
   Reason: single store accessible to all MFEs
```

### What NOT to Share

```
1. MFE-specific business logic
   Reason: encapsulation leak, direct coupling

2. Internal utils and helpers
   Reason: create implicit dependencies between MFEs

3. Rarely used libraries
   Reason: negotiation overhead not justified

4. Libraries with frequently changing versions
   Reason: constant conflicts and update synchronization
```

### Decision Diagram

```
Library X → Used in 2+ MFEs?
  → No → Don't share
  → Yes → Has global state / context?
    → Yes → Share: singleton: true
    → No → Size > 30KB?
      → No → Don't share
      → Yes → Share: singleton: false
```

## Externals + CDN: When It Makes Sense

Externals — classic pattern, still alive in legacy projects and scenarios without Module Federation.

### CDN Externals Pros

- Simplicity: understandable without MF knowledge
- CDN cached at browser level (shared cache, though no longer in modern browsers)
- Works without bundler changes

### CDN Externals Cons

- UMD bundles heavier than ESM (no tree-shaking)
- Polluting `window` with global variables
- CDN = single point of failure
- No version negotiation — everyone must update synchronously

### Modern Alternative

```html
<!-- Instead of CDN UMD, use ESM + importmap -->
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.3.0"
  }
}
</script>
```

ESM via importmap gives caching without polluting `window` and with tree-shaking support.

## Monitoring Shared Dependencies

How to tell if sharing works in production?

1. **Chrome DevTools → Network**: find `react.js` — it should load only once
2. **webpack-bundle-analyzer**: no React in MFE bundles with proper sharing
3. **Browser console**: MF outputs version mismatch warnings in dev mode

```js
// In code: check which React version is being used
console.log(React.version) // should be the same across all MFEs
```

## ⚠️ Common Beginner Mistakes

### 1. Singleton Without eager at Entry Point

```js
// ❌ Error: Shell uses React in index.js, but not eager
shared: {
  react: { singleton: true } // eager: false by default
}

// ✅ Correct: eager + async boundary
shared: {
  react: { singleton: true, eager: true }
}
// + split index.js and bootstrap.js
```

### 2. Exact Versions Instead of Ranges

```js
// ❌ Any update to any MFE = update all
requiredVersion: '18.2.0'

// ✅ Patches and minor updates are compatible
requiredVersion: '^18.0.0'
```

### 3. Sharing Too Small Packages

```js
// ❌ Negotiation overhead > sharing benefit
shared: {
  'classnames': { singleton: false }, // 1.5 KB — not worth sharing
  'uuid': { singleton: false },        // 5 KB — questionable
}
```

### 4. Import Map Not at the Beginning of head

```html
<!-- ❌ Too late — modules already started resolving -->
<script type="module" src="./app.js"></script>
<script type="importmap">...</script>

<!-- ✅ Correct: importmap before all module scripts -->
<script type="importmap">...</script>
<script type="module" src="./app.js"></script>
```
