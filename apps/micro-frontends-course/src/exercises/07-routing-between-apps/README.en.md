# Level 7: Routing Between Applications

## The Problem: Each MFE Has Its Own Router

Imagine an orchestra where each musician has their own clock — and they play by it. That's exactly what a URL looks like in a microfrontend system without centralized routing: Shell thinks it's `/catalog`, Cart MFE thinks it's `/cart/checkout`, and the browser history contains a mix of their attempts to control the address bar.

The browser has one URL. But we have four teams, each wanting to be the conductor.

## Shell-Router: One URL Owner

Fundamental principle: **only Shell owns the `history` API**. MFEs never call `history.pushState()` directly.

```
Browser URL ←── history.pushState() ←── Shell Router
                                              ↑
                         CustomEvent('navigate', { path }) ←── Catalog MFE
                         CustomEvent('navigate', { path }) ←── Cart MFE
                         CustomEvent('navigate', { path }) ←── Profile MFE
```

Shell listens to events from MFEs, decides on navigation, and is the only one that changes the URL.

```js
// Shell: listen for navigation requests from all MFEs
window.addEventListener('mfe:navigate', (event) => {
  const { path } = event.detail
  router.navigate(path) // Shell performs the navigation
})

// Catalog MFE: wants to navigate — ask Shell
function navigateTo(path) {
  window.dispatchEvent(
    new CustomEvent('mfe:navigate', { detail: { path } })
  )
}
```

## Top-level vs Nested Routing

Routes are divided into two levels:

```
/ ──────────────────────── Shell (top level)
├── /catalog/* ──────────── Catalog MFE (owns sub-paths)
│   ├── /catalog ──────────── CatalogList (inside MFE)
│   ├── /catalog/search ───── CatalogSearch
│   └── /catalog/:id ──────── ProductDetail
├── /cart/* ─────────────── Cart MFE
│   ├── /cart ──────────────── CartPage
│   └── /cart/checkout ────── CheckoutPage
└── /profile/* ──────────── Profile MFE
```

Shell only knows about the top level (`/catalog/*`). Everything starting with `/catalog/` is Catalog MFE's responsibility. Shell delegates control and doesn't interfere with internal routes anymore.

```js
// React Router v6 in Shell
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/catalog/*',      // wildcard: everything after /catalog/ — Catalog MFE
    element: <CatalogMFE />,
    // no children needed: Catalog MFE's internal router handles it
  },
  {
    path: '/cart/*',
    element: <CartMFE />,
  },
])
```

Inside the Catalog MFE, its own Router only sees relative paths:

```js
// Catalog MFE (internal router)
const catalogRouter = createBrowserRouter([
  { index: true, element: <CatalogList /> },         // /catalog
  { path: 'search', element: <CatalogSearch /> },    // /catalog/search
  { path: ':id', element: <ProductDetail /> },       // /catalog/:id
])
```

## pushState Conflict: When Two MFEs Dispute the URL

```
time:   ─────────────────────────────────────────→
Cart:         pushState('/cart/checkout') ────┐
Catalog:                          pushState('/catalog/42') ─┐
                                               ↓             ↓
URL:                               /cart/checkout   /catalog/42  ← last one wins!
```

This is not a theoretical problem. In real applications this happens during:
- Simultaneous mounting of multiple MFEs
- Race conditions on async MFE loading
- MFE "waking up" and trying to restore its state

⚠️ `history.pushState()` doesn't throw an exception on conflict — the second call silently overwrites the first.

## Navigation Communication

Two patterns: Custom Events and Shared Bus.

**Custom Events** — simple browser standard, no extra libraries needed:

```js
// MFE sends request
window.dispatchEvent(new CustomEvent('mfe:navigate', {
  detail: { path: '/cart/checkout', source: 'cart-mfe' }
}))

// Shell listens and executes
window.addEventListener('mfe:navigate', ({ detail }) => {
  console.log(`[Shell] navigation requested by ${detail.source}: ${detail.path}`)
  router.navigate(detail.path)
})
```

**Shared Navigation Bus** — if you need a queue, event history, middleware:

```js
// navigation-bus.js (shared singleton)
class NavigationBus {
  private handlers: Array<(path: string) => void> = []

  navigate(path: string, source: string) {
    console.log(`[NavigationBus] ${source} → ${path}`)
    this.handlers.forEach(h => h(path))
  }

  onNavigate(handler: (path: string) => void) {
    this.handlers.push(handler)
    return () => this.handlers = this.handlers.filter(h => h !== handler)
  }
}

export const navigationBus = new NavigationBus()
```

## Deep Linking

A deep link is a URL typed directly or received from an external source. For example, a user opens `/catalog/42` via an email link.

```
Scenario:
  1. Browser loads page with URL /catalog/42
  2. Shell analyzes URL: path starts with /catalog → needs Catalog MFE
  3. Shell loads Catalog MFE
  4. Passes initialPath = '/catalog/42'
  5. Catalog MFE mounts and internal router immediately opens ProductDetail
```

```js
// Shell passes initial path to MFE
function CatalogMFE() {
  const location = useLocation()
  return (
    <CatalogApp
      initialPath={location.pathname}  // '/catalog/42'
      basePath="/catalog"
    />
  )
}
```

## Lazy vs Eager MFE Loading

| | Lazy | Eager |
|---|---|---|
| When loaded | On first route transition | On Shell startup |
| First render time | Slightly slower (+ load time) | Instant |
| Impact on Shell startup | None | Increases |
| Suitable for | Most MFEs | Shell, frequently used MFEs |

```js
// Lazy (recommended for most MFEs)
const CatalogMFE = lazy(() => import('./catalog/catalog-entry'))

// Eager (for critical ones)
import CatalogMFE from './catalog/catalog-entry'
```

## SEO and Server-Side Rendering

For public pages, deep linking isn't enough — SSR is needed. Each MFE must be able to render on the server for its routes:

```
GET /catalog/42
  → Server: determines route → Catalog MFE
  → Renders ProductDetail on server
  → Returns HTML with correct title, meta og:*, structured data
```

📌 In most B2B and internal apps, SSR isn't needed — client-side deep linking with proper `nginx` config (`try_files $uri /index.html`) is enough.

## Strategy: Routing Team Rules

```
✅ Shell owns history API — only Shell calls pushState
✅ MFEs use events/bus for navigation requests
✅ Shell route = prefix + wildcard (/catalog/*)
✅ MFE route = relative paths without base (search, :id)
✅ Deep links handled by Shell: URL → correct MFE → initialPath
✅ Route order: exact routes before wildcards, * at the end

❌ MFE doesn't call history.pushState() or history.replaceState() directly
❌ Don't duplicate shell prefix in MFE internal routes (/catalog/search — bad, search — good)
❌ Wildcard route (*) not at end of list — subsequent routes never match
```
