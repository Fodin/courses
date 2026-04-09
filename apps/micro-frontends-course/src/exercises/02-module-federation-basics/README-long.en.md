# Module Federation: Detailed Theory

## History: How We Got to Module Federation

Before 2020, teams building microfrontends solved the shared dependency problem in three ways, and all three had serious drawbacks:

**1. Global variables via CDN**
```html
<script src="https://cdn.example.com/react@18.js"></script>
<!-- Each MFE relies on window.React -->
```
Worked, but tied all MFEs to a single version and required release coordination.

**2. NPM monorepo with shared packages**
All MFEs in one repo, shared dependencies hoisted. Killed team independence — changing the React version required updating the entire monorepo.

**3. Full isolation (iframe)**
Each MFE is a separate `<iframe>`. Maximum isolation, but huge overhead: each iframe pulled its own React, its own router, its own design system.

In **2020**, Zack Jackson and the Webpack team introduced the **Module Federation Plugin** for Webpack 5. The idea was revolutionary: dependencies can be shared at runtime, not just at build time.

---

## Detailed Webpack MF Configuration Breakdown

```js
// webpack.config.js — remote
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'catalogApp',          // (1) unique name in global scope
      filename: 'remoteEntry.js',  // (2) entry-point file
      exposes: {                   // (3) public API
        './App': './src/App',
        './ProductCard': './src/components/ProductCard',
      },
      shared: {                    // (4) shared dependencies
        react: {
          singleton: true,         // (5) only one instance
          requiredVersion: '^18.0.0',
          eager: false,            // (6) don't include in entry chunk
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.0.0',
        },
      },
    }),
  ],
}
```

### Field `name` (1)

The name becomes a global variable in the browser. `name: 'catalogApp'` creates `window.catalogApp`. Therefore names must be unique within a single host. Use camelCase without spaces or special characters.

### Field `filename` (2)

Default is `remoteEntry.js`. This is the manifest file that the host requests first. It contains:
- List of available modules (exposes)
- List of required shared dependencies with versions
- Links to actual chunk files

Size is usually 2-10 KB. Its URL is specified in the host config and must match the remote deploy address.

### Field `exposes` (3)

A "public name → real path" dictionary. Keys should start with `./` — this is an ES Module path convention.

```js
exposes: {
  './App': './src/App.tsx',
  // Consumer: import('catalogApp/App')
  //                      ^name  ^key
}
```

Everything not in `exposes` is private. Internal utilities, types, helper components won't get out automatically.

### Field `shared` (4)

This is where Module Federation magic begins. When the runtime sees that both host and remote declared `react` in shared, it:
1. Checks if a compatible `react` is already loaded (via semver version comparison)
2. If yes — returns the same instance
3. If not — loads a new one, but marks it as "available for subsequent remotes"

### Flag `singleton` (5)

Critical for React. React stores hook state in its module's global object. If two MFEs load different React instances — hooks will work with different objects, and you'll see:

```
Error: Invalid hook call. Hooks can only be called inside of a function component.
```

`singleton: true` tells MF: "if the version is incompatible — don't load a new copy, use the one that exists, and output a warning to the console." This is a compromise between correctness and isolation.

### Flag `eager` (6)

By default `eager: false`. This means the shared dependency is loaded lazily. `eager: true` includes the dependency in the entry chunk — useful for avoiding waterfall on initialization, but increases the entry size.

---

## Vite Plugin Federation: Differences

`@originjs/vite-plugin-federation` implements the same concepts, but there are nuances:

```ts
// vite.config.ts
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    federation({
      name: 'catalogApp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: ['react', 'react-dom'],
      // or extended form:
      // shared: { react: { singleton: true, ... } }
    }),
  ],
  build: {
    target: 'esnext',  // REQUIRED for ESM chunks
    minify: false,     // recommended for debugging
  },
  preview: {
    port: 3001,
    strictPort: true,  // don't change port if busy — fail with error
  },
})
```

**Key difference**: Vite plugin only works with `build` (production preview). In `dev` mode, Module Federation is not active — you need to run `vite build && vite preview` for each remote before developing the host. This is the main inconvenience compared to Webpack MF.

---

## Real-World Example: E-commerce Platform

Imagine an online store with three teams:

### Repository Structure

```
apps/
  shell/          # host, loads all remotes
  catalog-mfe/    # product catalog
  cart-mfe/       # shopping cart
  user-mfe/       # user profile
```

### catalog-mfe/vite.config.ts

```ts
federation({
  name: 'catalogApp',
  filename: 'remoteEntry.js',
  exposes: {
    './CatalogPage': './src/pages/CatalogPage.tsx',
    './ProductCard': './src/components/ProductCard.tsx',
    './useProduct': './src/hooks/useProduct.ts',
  },
  shared: {
    'react': { singleton: true, requiredVersion: '^18.2.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
    'react-router-dom': { singleton: true, requiredVersion: '^6.8.0' },
  },
})
```

### shell/vite.config.ts

```ts
federation({
  name: 'shell',
  remotes: {
    catalogApp: 'catalogApp@http://catalog.internal/remoteEntry.js',
    cartApp: 'cartApp@http://cart.internal/remoteEntry.js',
    userApp: 'userApp@http://user.internal/remoteEntry.js',
  },
  shared: {
    'react': { singleton: true, requiredVersion: '^18.2.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
    'react-router-dom': { singleton: true, requiredVersion: '^6.8.0' },
  },
})
```

### shell/src/App.tsx

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const CatalogPage = React.lazy(() => import('catalogApp/CatalogPage'))
const CartPage = React.lazy(() => import('cartApp/CartPage'))
const UserProfile = React.lazy(() => import('userApp/ProfilePage'))

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/catalog/*" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

---

## Webpack MF vs vite-plugin-federation Comparison

### Webpack Module Federation

**Advantages:**
- Native support (Webpack 5+), no plugins needed
- Works in dev mode with HMR for federated modules (in Webpack 5.x)
- Maturity: in production since 2020, huge community
- SSR support (partial, via NextFederationPlugin)
- Module Federation 2.0 (2024): improved types, runtime API

**Disadvantages:**
- Slow build compared to Vite
- Complex configuration
- Requires CommonJS or special adapters for ESM

### vite-plugin-federation

**Advantages:**
- Vite: instant dev server
- Simple configuration, familiar syntax
- Pure ESM output
- Actively developing

**Disadvantages:**
- No dev mode for federated modules (requires `build && preview`)
- SSR support is limited
- Less community and examples
- Some edge cases (circular deps) are worse handled

### Module Federation 2.0

In 2024, `@module-federation/core` was released — a reworked core supporting Webpack, Rspack, and (experimentally) Vite. Key improvements:
- Typed manifests (TypeScript-first)
- Runtime API for dynamic remote registration
- Improved shared-resolution algorithm

---

## Pitfalls and Best Practices

### Pitfall 1: Shared versions must match semantically

Host declares `react@^17.0.0`, remote — `react@^18.0.0`. Module Federation cannot find a compatible version (^17 doesn't include 18). With `singleton: true` there will be a warning and the host version will load, the remote may break due to incompatible APIs.

📌 **Best practice**: agree on major versions of key shared dependencies at the team level. Use `requiredVersion: '>=17.0.0 <19.0.0'` for a wider range.

### Pitfall 2: TypeScript types for remote modules

By default, TypeScript doesn't know about types from `catalogApp/App`. You need `declare module`:

```ts
// src/types/remotes.d.ts
declare module 'catalogApp/App' {
  import type { ComponentType } from 'react'
  const CatalogApp: ComponentType
  export default CatalogApp
}
```

Module Federation 2.0 solves this via auto-generated types, but in vite-plugin-federation you need to do it manually or via `@mf-types-webpack-plugin`.

### Pitfall 3: CSS isolation

Remote components are not isolated by CSS. If remote imports global styles — they will affect the host. Solutions:
- CSS Modules (isolated by hash by default)
- CSS-in-JS (styled-components, emotion)
- Shadow DOM (radical, breaks many patterns)

### Best practice: version negotiation in prod

In production, the remoteEntry.js URL should include a version or hash:
```
http://catalog.internal/v1.5.0/remoteEntry.js
# or
http://catalog.internal/remoteEntry.js?v=1.5.0
```

This allows rolling back to a previous remote version without changing the host.

### Best practice: fallback when remote is unavailable

```tsx
const CatalogApp = React.lazy(() =>
  import('catalogApp/App').catch(() => ({
    default: () => <div>Catalog is temporarily unavailable</div>
  }))
)
```

Always wrap remote imports in try/catch or .catch(). If a remote server is down — the host should not crash entirely.

### Best practice: local development

For developing the host without running remotes, use fallback modules:

```ts
// vite.config.ts (dev only)
remotes: {
  catalogApp: isDev
    ? 'catalogApp@http://localhost:3001/remoteEntry.js'
    : 'catalogApp@https://catalog.prod.example.com/remoteEntry.js',
}
```

And component stubs for offline development.
