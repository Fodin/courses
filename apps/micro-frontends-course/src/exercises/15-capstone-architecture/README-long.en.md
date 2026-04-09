# Capstone: MFE Platform Architecture Design — Extended Guide

## Full Course Overview

Over 15 levels of this course, we went from the question "why do we even need micro-frontends" to designing a full production platform. Each level solved one specific problem:

```mermaid
graph LR
  L0["00 — Why MFE?\nMonolith vs MFE"] --> L1["01 — Patterns\nRouting, Composition, Edge Side"]
  L1 --> L2["02 — Module Federation\nBasics: host, remote, shared"]
  L2 --> L3["03 — Module Federation\nAdvanced: versions, registry"]
  L3 --> L4["04 — Single-SPA\nOrchestration lifecycle"]
  L4 --> L5["05 — Web Components\nShadow DOM, Custom Elements"]
  L5 --> L6["06 — Shared Dependencies\nsingleton, versioning"]
  L6 --> L7["07 — Routing\nShell routing, deep links"]
  L7 --> L8["08 — Communication\nEventBus, Shared State"]
  L8 --> L9["09 — Design System\nCSS isolation, tokens"]
  L9 --> L10["10 — Deploy\nversioning, canary"]
  L10 --> L11["11 — Testing\ncontract, integration"]
  L11 --> L12["12 — Monitoring\nerror boundary, SLO"]
  L12 --> L13["13 — Migration\nstrangler fig"]
  L13 --> L14["14 — DX\nmonorepo, tooling"]
  L14 --> L15["15 — Capstone\nfull platform"]
```

Every decision is made in context. There is no "right" answer outside of team size, technical debt, budget, and SLA.

## Designing an E-commerce MFE Platform: Full Breakdown

### Domain Decomposition

The first and most important step is to split the system by business domains, not by technical layers. Conway's Law states: "Organizations which design systems are constrained to produce designs which are copies of the communication structures of these organizations."

| MFE | Domain | Team | Criticality |
|-----|--------|------|-------------|
| Shell | Orchestration, auth | Platform | Critical |
| Catalog | Product browsing, search | Commerce | High (SEO) |
| Cart | Cart, promo codes | Commerce | High |
| Checkout | Payment, delivery | Payments | Critical (PCI) |
| Profile | Account, order history | Identity | Medium |
| Admin | Catalog management | Internal | Low (internal) |

Note: Catalog and Cart are on the same Commerce team. This is not a violation of the "one team = one MFE" principle — it is a deliberate decision at an early stage. When Commerce grows, they can be split.

### Communication Matrix

Event-driven architecture avoids direct dependencies between MFEs:

| From \ To | Shell | Catalog | Cart | Checkout | Profile |
|-----------|-------|---------|------|----------|---------|
| Shell | — | user:logout | user:logout | user:logout | user:logout |
| Catalog | mfe:ready | — | cart:add | — | — |
| Cart | — | — | — | checkout:start | — |
| Checkout | — | — | payment:failed | — | order:created |
| Profile | auth:changed | — | — | — | — |

Each event has a strictly typed payload. Changing the payload means event versioning.

### Deploy Matrix

Different MFEs require different deployment strategies:

| MFE | Strategy | Reason |
|-----|----------|--------|
| Shell | Blue/Green | Any Shell downtime = platform downtime |
| Catalog | Canary (15%) | High traffic, SEO risk on errors |
| Cart | Rolling | Moderate traffic, stateless |
| Checkout | Blue/Green + manual approval | PCI DSS, money |
| Profile | Rolling | Low criticality |
| Admin | Direct | Internal only, low traffic |

### SLO Matrix

| MFE | SLO Availability | Error Budget | Monitoring |
|-----|------------------|--------------|------------|
| Shell | 99.9% | 8.7 hours/year | Datadog + PagerDuty |
| Catalog | 99.5% | 43.8 hours/year | Datadog + Slack |
| Cart | 99.5% | 43.8 hours/year | Datadog + Slack |
| Checkout | 99.95% | 4.4 hours/year | Datadog + PagerDuty (24/7) |
| Profile | 99.5% | 43.8 hours/year | Datadog |
| Admin | 99% | 87.6 hours/year | Metrics only |

## Patterns Recap: When to Use What

### MFE Integration

**Module Federation** — choose if:
- Stack is predominantly React/Vue (single framework)
- Efficient dependency sharing is needed (react, react-dom as singletons)
- Webpack/Rspack is already in the stack
- No strict security isolation requirements

**Single-SPA** — choose if:
- MFE lifecycle orchestration is needed at the framework level
- Mixed frameworks with a shared router
- Parcel mode is needed (MFE without routing, embeddable widgets)
- Multi-tenant runtime customization

**Web Components** — choose if:
- Maximum isolation via Shadow DOM (CSS doesn't leak)
- Different frameworks in one platform (Angular + React + Vue)
- Strict security requirements (PCI, healthcare)
- MFE as reusable widgets

**Import Maps** — choose if:
- You want native ESM without a bundler
- Experimental approach, browser support is not an issue
- Small/medium platforms without legacy

### Repository

**Monorepo (Nx)** — for large teams (5+) with tight dependencies. Nx provides module boundaries, dep graph, generators.

**Monorepo (Turborepo)** — a simpler option without opinionated configuration. Suitable for 3-5 teams.

**Polyrepo** — for platforms with strict security/compliance requirements, where code isolation is more important than DX.

### Deploy

**Independent deploy** — the fundamental MFE principle. Versioned URLs (not `latest`).

**Canary** — for high-traffic MFEs where risk is high. Phased rollout from 1% to 100%.

**Blue/Green** — for critical MFEs (Checkout, Shell). Instant rollback.

**Feature Flags** — not a deploy strategy, but a complement. Allows deploying code without enabling the feature.

## Common Architect Mistakes

### Mistake 1: Start with Technology, Not Domains

Event Storming → DDD Bounded Contexts → Conway's Law → only then Module Federation or Single-SPA.

Without understanding domains, MFEs turn into "technical layers" (ui-mfe, data-mfe, logic-mfe) — this is an anti-pattern.

### Mistake 2: Premature Splitting

At the start with 3 teams and 2 MFEs, a monolith is often the best solution. MFEs are for scale. If teams are small and not independent, MFE overhead doesn't pay off.

"We started with 1 team and 8 MFEs. A year later we were merging them back" — a common story.

### Mistake 3: Ignoring Network Waterfalls

```
Shell loaded (100ms)
  → fetches remoteEntry.js catalog (200ms)
  → fetches remoteEntry.js cart (200ms)
  → fetches remoteEntry.js checkout (200ms)
  → renders page (total: 700ms+)
```

Solution: prefetch remoteEntry.js in `<link rel="prefetch">`, preloading in Shell.

### Mistake 4: Coupling via Shared Store

If 3 MFEs read and write to the same Redux store, this is not an MFE architecture — it's a monolith with added complexity.

Each MFE has its own internal state. Synchronization only through events or explicit contracts.

### Mistake 5: No Local Dev Mode

If you need to launch 6 servers to develop one button — that's bad DX that kills team productivity. A Mock Remote strategy should be set up from day one.

## The Future of MFE: 2025 and Beyond

### Module Federation 2.0

The Webpack team introduced Module Federation 2.0 as a standalone package `@module-federation/core`:

```ts
// Module Federation 2.0 — runtime without webpack
import { init, loadRemote } from '@module-federation/runtime'

init({
  name: 'shell',
  remotes: [
    { name: 'catalog', entry: 'https://cdn.example.com/catalog/remoteEntry.js' }
  ],
})

// Dynamic loading
const CatalogApp = await loadRemote('catalog/App')
```

Key changes:
- Runtime works without webpack — can be used with Rspack, Vite, Rollup
- Automatic typing: `@module-federation/dts-plugin` generates `.d.ts` for remote modules
- `FederationHost` API for programmatic control

### Rspack

```json
// rspack.config.js — almost identical to webpack
{
  "plugins": [
    new ModuleFederationPlugin({
      "name": "catalog",
      "exposes": { "./App": "./src/App.tsx" }
    })
  ]
}
```

Rspack is compatible with the webpack plugin API, but written in Rust. Builds are 5-10x faster. Supports Module Federation 2.0.

### Native Federation

Manfred Steyer (Angular architect) developed Native Federation — an implementation of MF ideas via native ES Modules:

```html
<!-- Import Map in index.html -->
<script type="importmap">
  {
    "imports": {
      "catalog/App": "https://cdn.example.com/catalog/main.js"
    }
  }
</script>
```

No webpack, no bundler-specific setup. The browser resolves modules via Import Map. Works wherever native ES modules support exists.

### Trendwatch

- **Vite + Module Federation** — the official plugin `@originjs/vite-plugin-federation` has stabilized
- **Micro-frontend meta-frameworks** — emerging as Single-SPA Parcels, but with better DX
- **Edge-side includes** — Cloudflare Workers for MFE composition at the CDN level (no client-side JS)
- **Islands Architecture** — Astro-style approach for SSR: only critical islands hydrate

The architectural trend: a shift from client-side composition (Module Federation) to server-side and edge composition for improved Core Web Vitals and SEO.
