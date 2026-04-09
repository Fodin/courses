# Level 6: Shared Dependencies

## The Problem: N Copies of React at Runtime

Imagine a restaurant where each waiter brings their own knife. Absurd? That's exactly how a microfrontend works without dependency sharing — each MFE drags its own copy of React, lodash, axios into the browser.

For an app with 4 MFEs, each using React (45 KB) + react-dom (130 KB) + router (52 KB), that's **875 KB** just on "infrastructure" — loaded four times.

```
Shell      → react 45KB + react-dom 130KB + ...
Catalog    → react 45KB + react-dom 130KB + ...  ← duplicate
Cart       → react 45KB + react-dom 130KB + ...  ← duplicate
Profile    → react 45KB + react-dom 130KB + ...  ← duplicate
```

But it's not just about traffic. **Two copies of React = two separate runtimes**, and they don't know about each other. Context from Shell isn't visible in Cart. Hooks break. This is worse than slow — it's non-functional.

## Import Maps: Browser Module Dispatcher

Import Maps is a native browser mechanism (no bundler!) that lets you override where the browser loads ES modules from.

```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.3.0",
    "react-dom": "https://esm.sh/react-dom@18.3.0"
  }
}
</script>

<script type="module">
  import React from 'react' // browser resolves → esm.sh/react@18.3.0
</script>
```

💡 Key property: the browser caches the URL. All MFEs referencing the same URL get **the same module from cache**.

### Scopes — Local Overrides

```json
{
  "imports": {
    "lodash": "https://cdn.jsdelivr.net/npm/lodash@4.17.21/+esm"
  },
  "scopes": {
    "/app-legacy/": {
      "lodash": "https://cdn.jsdelivr.net/npm/lodash@3.10.1/+esm"
    }
  }
}
```

Scope `/app-legacy/` — like a "local law": only this path uses the old lodash, everyone else takes the global one.

## Module Federation: `shared` Configuration

Webpack Module Federation solves sharing at the bundler level. Key options:

```js
// webpack.config.js (Shell — host)
new ModuleFederationPlugin({
  shared: {
    react: {
      singleton: true,       // only ONE copy at runtime
      eager: true,           // load immediately, not async
      requiredVersion: '^18.0.0',  // range of compatible versions
    },
    'react-dom': {
      singleton: true,
      eager: true,
      requiredVersion: '^18.0.0',
    },
    zustand: {
      singleton: false,      // each MFE can have its own copy
      requiredVersion: '^4.0.0',
    }
  }
})
```

### singleton vs non-singleton

| | singleton: true | singleton: false |
|---|---|---|
| Runtime copies | 1 | one per MFE |
| Suitable for | React, React Context, Design System | utilities without global state |
| Risk | version mismatch blocks loading | code duplication |

### eager: true — When Needed

By default, shared modules load lazily (async chunk). If the Shell itself uses React at the entry point — you need `eager: true`, otherwise you'll get "Shared module is not available for eager consumption".

📌 Solution via async boundary:

```js
// bootstrap.js (separate file)
import('./App') // <- dynamic import creates async boundary

// index.js
import('./bootstrap') // entry point only imports bootstrap
```

## Externals + CDN: Classic Approach

Before Module Federation, `externals` in webpack + global variables via CDN were used:

```js
// webpack.config.js
externals: {
  react: 'React',
  'react-dom': 'ReactDOM',
}
```

```html
<!-- index.html -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

❌ Drawbacks: pollutes `window`, UMD bundles larger than ESM, no tree-shaking, CDN — single point of failure.

## Strategy: What to Share and What Not

```
✅ Share:
  - react, react-dom          (singleton required)
  - react-router-dom          (need single router context)
  - design system / UI kit    (shared components, themes)
  - shared store (zustand/redux) if unified state needed

❌ DON'T share:
  - MFE business logic        (violates isolation)
  - MFE-specific utilities    (versions may diverge)
  - dev-only dependencies     (don't end up in prod bundle)
```

## Version Conflicts

⚠️ Module Federation with `singleton: true` on version mismatch outputs a warning to the console and may refuse to load. Rule: all MFEs must specify `requiredVersion` with a semver range, not an exact version.

```js
// ❌ Fragile — any patch requires updating all MFEs
requiredVersion: '18.2.0'

// ✅ Flexible — accepts any patch within minor
requiredVersion: '^18.2.0'
```
