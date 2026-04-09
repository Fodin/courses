# DX и инструментарий для микрофронтендов: полное руководство

Команда принимает решение перейти на MFE. Проходит месяц, и разработчики начинают жаловаться: «я трачу полчаса на запуск окружения», «я не знаю, какую версию UI-кита использовать», «я скопировал boilerplate и забыл поменять порт, теперь два MFE конфликтуют». Developer Experience деградировал — и это закономерно, если DX не проектировали намеренно.

Хороший DX в MFE означает: разработчик нового MFE должен запустить одну команду и начать работать за 5 минут. Независимо от того, сколько других MFE существует в системе.

## Monorepo: детальный разбор

### Почему Nx популярен в MFE

Nx решает главную проблему monorepo: при 10+ пакетах `npm run build` занимает 20 минут, даже если изменился один файл. Nx строит граф зависимостей между проектами:

```
shell → catalog-mfe, cart-mfe, checkout-mfe
catalog-mfe → @company/ui-kit, @company/utils
cart-mfe → @company/ui-kit, @company/utils
checkout-mfe → @company/ui-kit, @company/utils, cart-mfe
@company/ui-kit → @company/design-tokens
```

`nx affected --target=build --base=main` определяет: изменился `@company/utils` → пересобрать catalog-mfe, cart-mfe, checkout-mfe, shell. `@company/design-tokens` не изменился → не трогать.

```json
// nx.json — расширенная конфигурация
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

Remote Cache — ключевая фича: результаты сборки хранятся централизованно. CI собрал `catalog-mfe` → разработчик запускает сборку локально → получает кэш из CI, сборка за секунды.

### Turborepo: минималистичная альтернатива

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

`dependsOn: ["^build"]` — символ `^` означает «зависимости из package.json». Turborepo определяет порядок через deps-граф пакетов, не через явную конфигурацию. Проще чем Nx, меньше возможностей.

### PNPM Workspaces: базовый вариант

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

`workspace:*` — PNPM заменит на реальную версию при публикации. При локальной разработке создаёт symlink на локальный пакет.

## Стратегии локальной разработки

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

Разработчик каталога запускает только `LOCAL_CATALOG_MFE=true npm run dev:shell`.

### Dynamic Remote Loading

```ts
// Динамически загружаем remote — можно переключать между dev и prod
async function loadRemote(name: string, devUrl: string, prodUrl: string) {
  const url = process.env.NODE_ENV === 'development' ? devUrl : prodUrl

  // @ts-ignore — webpack magic
  const container = window[name] as RemoteContainer
  if (!container) {
    await loadScript(url) // динамически добавляем script tag
  }
  await window[name].init(__webpack_share_scopes__.default)
  const factory = await window[name].get('./App')
  return factory()
}
```

### MSW как Mock для MFE API

```ts
// При разработке MFE в изоляции — MSW мокает API других MFE
import { setupWorker, rest } from 'msw'

const worker = setupWorker(
  // Мок API корзины (cart MFE не запущен)
  rest.get('/api/cart', (req, res, ctx) => {
    return res(ctx.json({ items: [], total: 0 }))
  }),
  // Мок пользователя из auth
  rest.get('/api/auth/me', (req, res, ctx) => {
    return res(ctx.json({ id: '1', name: 'Dev User', roles: ['admin'] }))
  })
)

if (process.env.NODE_ENV === 'development') {
  worker.start()
}
```

## Shared Конфигурации: архитектура пакетов

### Структура shared packages

```
packages/
  eslint-config/
    package.json          ← { "name": "@company/eslint-config" }
    index.js              ← module.exports = { extends, rules }
    react.js              ← дополнения для React-проектов
  tsconfig/
    package.json          ← { "name": "@company/tsconfig" }
    base.json             ← compilerOptions базовые
    react.json            ← extends base + JSX
    node.json             ← extends base + Node.js types
  prettier-config/
    package.json          ← { "name": "@company/prettier-config", "main": "index.json" }
    index.json            ← { "semi": false, "singleQuote": true }
  vite-config/
    package.json          ← { "name": "@company/vite-config" }
    mfe.ts                ← preset для MFE с Module Federation
    library.ts            ← preset для shared library
```

### Versioning shared конфигов

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

В monorepo версионирование не нужно — `workspace:*`. В polyrepo нужно публиковать в npm registry (внутренний Verdaccio или npmjs.org private).

## CLI для Scaffolding: реализация

### Plop.js — самый простой вариант

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
      // После генерации — добавить в nx.json / turbo.json
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

### Валидация при scaffolding

```ts
// Проверки перед генерацией
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

## Детектор циклических зависимостей

### Алгоритм обнаружения цикла (DFS)

```ts
type Graph = Record<string, string[]>

function detectCycles(graph: Graph): string[][] {
  const cycles: string[][] = []
  const visited = new Set<string>()
  const inStack = new Set<string>()

  function dfs(node: string, path: string[]): void {
    if (inStack.has(node)) {
      // Нашли цикл — извлечь путь цикла
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

// Использование
const graph = {
  'payments': ['checkout'],
  'checkout': ['payments'],  // цикл!
  'catalog': ['ui-kit'],
  'ui-kit': []
}

const cycles = detectCycles(graph)
// [['payments', 'checkout', 'payments']]
```

## Метрики хорошего DX

Ориентиры для команды:

| Метрика | Плохо | Хорошо | Отлично |
|---------|-------|--------|---------|
| Время до first HMR update | > 30 сек | 10–30 сек | < 10 сек |
| Время scaffolding нового MFE | > 30 мин | 10–30 мин | < 5 мин |
| Команд для запуска dev окружения | 3+ | 2 | 1 |
| Время CI для одного MFE | > 15 мин | 5–15 мин | < 5 мин |
| Время CI при affected = 1 MFE | > 15 мин | 5–15 мин | < 5 мин |

## ⚠️ Типичные ошибки новичков

### Ошибка 1: Polyrepo без автоматизации синхронизации

❌ Каждый репозиторий обновляет `@company/ui-kit` самостоятельно. Через 3 месяца 8 MFE используют 5 разных версий.

```
catalog-mfe:   ui-kit@1.0.0
cart-mfe:      ui-kit@1.2.0
checkout-mfe:  ui-kit@1.0.0
payments-mfe:  ui-kit@2.0.0  ← breaking change, только они обновились
```

✅ Renovate Bot или Dependabot автоматически создаёт PR в каждый репо при выходе новой версии shared-пакета.

### Ошибка 2: Monorepo без module boundaries

❌ В monorepo разработчики начинают импортировать из соседних MFE напрямую:

```ts
// В cart-mfe/src/CartPage.tsx
import { ProductCard } from '../../catalog-mfe/src/components/ProductCard'
```

Теперь cart-mfe не может деплоиться независимо от catalog-mfe.

✅ Nx `@nrwl/enforce-module-boundaries` запрещает импорты между MFE-приложениями через ESLint-правило.

### Ошибка 3: HMR не работает с Module Federation

❌ Разработчик вносит изменение в remote MFE, ждёт обновления в host — ничего не происходит. Или страница перезагружается полностью вместо hot update.

Причина: remoteEntry.js содержит chunk hashes, при HMR они меняются, но host не знает об этом.

✅ Для Webpack: `devServer: { hot: true, liveReload: false }` + `writeToDisk: true` для remoteEntry.js. Для Vite: `@originjs/vite-plugin-federation` поддерживает HMR нативно с версии 1.3+.

### Ошибка 4: Один глобальный tsconfig без hierarchy

❌ Один `tsconfig.json` в корне monorepo на все проекты — MFE с React и Node.js скрипты используют одни настройки.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",    // нужно для React-MFE
    "lib": ["dom"],        // ломает Node.js скрипты
    "types": ["jest"]      // загрязняет все проекты
  }
}
```

✅ Иерархия: `base.json` → `react.json` → `tsconfig.json` в каждом пакете.

### Ошибка 5: CI без кэширования артефактов

❌ Каждый PR пересобирает все shared пакеты с нуля, даже если они не изменились.

✅ Nx Remote Cache или Turborepo Remote Cache: результаты сборки из CI переиспользуются разработчиками и следующими CI-запусками.
