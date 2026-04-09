# DX and Tooling for Microfrontends: Complete Guide

A team decides to migrate to MFEs. A month passes and developers start complaining: "I spend half an hour starting the environment," "I don't know which UI kit version to use," "I copied the boilerplate and forgot to change the port, now two MFEs conflict." Developer Experience has degraded — and that's expected if DX wasn't designed intentionally.

Good DX in MFE means: a new MFE developer should run one command and start working within 5 minutes. Regardless of how many other MFEs exist in the system.

## Monorepo: Detailed Breakdown

### Why Nx is Popular in MFE

Nx solves the main monorepo problem: with 10+ packages, `npm run build` takes 20 minutes, even if only one file changed. Nx builds a dependency graph between projects:

```
shell → catalog-mfe, cart-mfe, checkout-mfe
catalog-mfe → @company/ui-kit, @company/utils
cart-mfe → @company/ui-kit, @company/utils
checkout-mfe → @company/ui-kit, @company/utils, cart-mfe
@company/ui-kit → @company/design-tokens
```

`nx affected --target=build --base=main` determines: `@company/utils` changed → rebuild catalog-mfe, cart-mfe, checkout-mfe, shell. `@company/design-tokens` unchanged → don't touch.

```json
// nx.json — extended config
{
  "affected": {
    "defaultBase": "main"
  },
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "test", "lint", "e2e"],
        "remoteCache": {
          "enabled": true,
          "url": "https://nx-cache.company.internal"
        }
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"]
    }
  }
}
```

Remote Cache — key feature: build results stored centrally. CI built `catalog-mfe` → developer runs build locally → gets cache from CI, build takes seconds.

### Turborepo: Minimalist Alternative

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"],
      "inputs": ["src/**", "package.json", "tsconfig.json"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**", "test/**"]
    }
  }
}
```

`dependsOn: ["^build"]` — `^` symbol means "dependencies from package.json." Turborepo determines order via package deps graph, not explicit configuration. Simpler than Nx, fewer features.

### PNPM Workspaces: Basic Option

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'      # shell, catalog-mfe, cart-mfe...
  - 'packages/*'  # ui-kit, utils, types, config
```

```json
// packages/ui-kit/package.json
{
  "name": "@company/ui-kit",
  "version": "1.0.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc && vite build"
  }
}
```

```json
// apps/catalog-mfe/package.json
{
  "dependencies": {
    "@company/ui-kit": "workspace:*",
    "@company/utils": "workspace:*"
  }
}
```

`workspace:*` — PNPM replaces with real version on publish. In local development, creates symlink to local package.

## Local Development Strategies

### URL-based Mock Remotes

```ts
// apps/shell/webpack.config.js
const MFE_URLS = {
  development: {
    catalogMfe: process.env.LOCAL_CATALOG_MFE
      ? 'catalogMfe@http://localhost:3001/remoteEntry.js'
      : 'catalogMfe@https://staging-cdn.company.com/catalog/remoteEntry.js',
    cartMfe: process.env.LOCAL_CART_MFE
      ? 'cartMfe@http://localhost:3002/remoteEntry.js'
      : 'cartMfe@https://staging-cdn.company.com/cart/remoteEntry.js',
  },
  production: {
    catalogMfe: 'catalogMfe@https://cdn.company.com/catalog/remoteEntry.js',
    cartMfe: 'cartMfe@https://cdn.company.com/cart/remoteEntry.js',
  }
}

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      remotes: MFE_URLS[process.env.NODE_ENV]
    })
  ]
}
```

Catalog developer runs only `LOCAL_CATALOG_MFE=true npm run dev:shell`.

### Dynamic Remote Loading

```ts
// Dynamically load remote — can switch between dev and prod
async function loadRemote(name: string, devUrl: string, prodUrl: string) {
  const url = process.env.NODE_ENV === 'development' ? devUrl : prodUrl

  // @ts-ignore — webpack magic
  const container = window[name] as RemoteContainer
  if (!container) {
    await loadScript(url) // dynamically add script tag
  }
  await window[name].init(__webpack_share_scopes__.default)
  const factory = await window[name].get('./App')
  return factory()
}
```

### MSW as Mock for MFE API

```ts
// When developing MFE in isolation — MSW mocks other MFEs' API
import { setupWorker, rest } from 'msw'

const worker = setupWorker(
  // Mock cart API (cart MFE not running)
  rest.get('/api/cart', (req, res, ctx) => {
    return res(ctx.json({ items: [], total: 0 }))
  }),
  // Mock user from auth
  rest.get('/api/auth/me', (req, res, ctx) => {
    return res(ctx.json({ id: '1', name: 'Dev User', roles: ['admin'] }))
  })
)

if (process.env.NODE_ENV === 'development') {
  worker.start()
}
```

## Shared Configurations: Package Architecture

### Shared Packages Structure

```
packages/
  eslint-config/
    package.json          ← { "name": "@company/eslint-config" }
    index.js              ← module.exports = { extends, rules }
    react.js              ← additions for React projects
  tsconfig/
    package.json          ← { "name": "@company/tsconfig" }
    base.json             ← basic compilerOptions
    react.json            ← extends base + JSX
    node.json             ← extends base + Node.js types
  prettier-config/
    package.json          ← { "name": "@company/prettier-config", "main": "index.json" }
    index.json            ← { "semi": false, "singleQuote": true }
  vite-config/
    package.json          ← { "name": "@company/vite-config" }
    mfe.ts                ← preset for MFE with Module Federation
    library.ts            ← preset for shared library
```

### Versioning Shared Configs

```json
// packages/eslint-config/package.json
{
  "name": "@company/eslint-config",
  "version": "2.1.0",
  "peerDependencies": {
    "eslint": ">=8.0.0",
    "typescript-eslint": ">=6.0.0"
  }
}
```

In monorepo, versioning isn't needed — `workspace:*`. In polyrepo, need to publish to npm registry (internal Verdaccio or npmjs.org private).

## CLI for Scaffolding: Implementation

### Plop.js — Simplest Option

```ts
// plopfile.ts
import type { NodePlopAPI } from 'plop'

export default function(plop: NodePlopAPI) {
  plop.setGenerator('mfe', {
    description: 'Scaffold new micro-frontend',
    prompts: [
      { type: 'input', name: 'name', message: 'MFE name (kebab-case):' },
      {
        type: 'list',
        name: 'type',
        choices: ['app', 'library', 'shared'],
        message: 'Package type:'
      },
      {
        type: 'checkbox',
        name: 'deps',
        choices: ['@company/ui-kit', '@company/utils', '@company/types'],
        message: 'Shared dependencies:'
      },
      {
        type: 'input',
        name: 'port',
        message: 'Dev server port (3001-3099):',
        validate: (value: string) => {
          const port = parseInt(value)
          return port >= 3001 && port <= 3099 ? true : 'Port must be 3001-3099'
        }
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'apps/{{name}}',
        templateFiles: 'templates/mfe/**',
        globOptions: { dot: true }
      },
      // After generation — add to nx.json / turbo.json
      {
        type: 'append',
        path: 'nx.json',
        pattern: /"projects": \{/,
        template: '    "{{name}}": "apps/{{name}}",'
      }
    ]
  })
}
```

### Scaffolding Validation

```ts
// Checks before generation
function validateMfeName(name: string, existingMfes: string[]): string | true {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    return 'Name must be kebab-case: lowercase letters, numbers, hyphens'
  }
  if (existingMfes.includes(name)) {
    return `MFE "${name}" already exists`
  }
  return true
}

function validatePort(port: number, usedPorts: number[]): string | true {
  if (usedPorts.includes(port)) {
    return `Port ${port} is already used by another MFE`
  }
  return true
}
```

## Circular Dependency Detector

### Cycle Detection Algorithm (DFS)

```ts
type Graph = Record<string, string[]>

function detectCycles(graph: Graph): string[][] {
  const cycles: string[][] = []
  const visited = new Set<string>()
  const inStack = new Set<string>()

  function dfs(node: string, path: string[]): void {
    if (inStack.has(node)) {
      // Found cycle — extract cycle path
      const cycleStart = path.indexOf(node)
      cycles.push([...path.slice(cycleStart), node])
      return
    }
    if (visited.has(node)) return

    visited.add(node)
    inStack.add(node)

    for (const dep of graph[node] ?? []) {
      dfs(dep, [...path, node])
    }

    inStack.delete(node)
  }

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) {
      dfs(node, [])
    }
  }

  return cycles
}

// Usage
const graph = {
  'payments': ['checkout'],
  'checkout': ['payments'],  // cycle!
  'catalog': ['ui-kit'],
  'ui-kit': []
}

const cycles = detectCycles(graph)
// [['payments', 'checkout', 'payments']]
```

## Good DX Metrics

Team benchmarks:

| Metric | Bad | Good | Excellent |
|--------|-----|------|-----------|
| Time to first HMR update | > 30 sec | 10–30 sec | < 10 sec |
| New MFE scaffolding time | > 30 min | 10–30 min | < 5 min |
| Commands to start dev env | 3+ | 2 | 1 |
| CI time for one MFE | > 15 min | 5–15 min | < 5 min |
| CI time when affected = 1 MFE | > 15 min | 5–15 min | < 5 min |

## ⚠️ Common Beginner Mistakes

### Mistake 1: Polyrepo Without Sync Automation

❌ Each repo updates `@company/ui-kit` independently. After 3 months, 8 MFEs use 5 different versions.

```
catalog-mfe:   ui-kit@1.0.0
cart-mfe:      ui-kit@1.2.0
checkout-mfe:  ui-kit@1.0.0
payments-mfe:  ui-kit@2.0.0  ← breaking change, only they updated
```

✅ Renovate Bot or Dependabot automatically creates PR in each repo when a new shared package version is released.

### Mistake 2: Monorepo Without Module Boundaries

❌ In monorepo, developers start importing from neighboring MFEs directly:

```ts
// In cart-mfe/src/CartPage.tsx
import { ProductCard } from '../../catalog-mfe/src/components/ProductCard'
```

Now cart-mfe can't deploy independently of catalog-mfe.

✅ Nx `@nrwl/enforce-module-boundaries` forbids imports between MFE apps via ESLint rule.

### Mistake 3: HMR Doesn't Work with Module Federation

❌ Developer makes change in remote MFE, waits for update in host — nothing happens. Or page fully reloads instead of hot update.

Cause: remoteEntry.js contains chunk hashes, on HMR they change, but host doesn't know about it.

✅ For Webpack: `devServer: { hot: true, liveReload: false }` + `writeToDisk: true` for remoteEntry.js. For Vite: `@originjs/vite-plugin-federation` supports HMR natively since version 1.3+.

### Mistake 4: Single Global tsconfig Without Hierarchy

❌ One `tsconfig.json` at monorepo root for all projects — React MFEs and Node.js scripts share same settings.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",    // needed for React MFE
    "lib": ["dom"],        // breaks Node.js scripts
    "types": ["jest"]      // pollutes all projects
  }
}
```

✅ Hierarchy: `base.json` → `react.json` → `tsconfig.json` in each package.

### Mistake 5: CI Without Artifact Caching

❌ Every PR rebuilds all shared packages from scratch, even if unchanged.

✅ Nx Remote Cache or Turborepo Remote Cache: CI build results reused by developers and subsequent CI runs.
