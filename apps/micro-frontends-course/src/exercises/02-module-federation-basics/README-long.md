# Module Federation: подробная теория

## История: как мы дошли до Module Federation

До 2020 года команды, строящие микрофронтенды, решали проблему общих зависимостей тремя способами, и все три имели серьёзные недостатки:

**1. Глобальные переменные через CDN**
```html
<script src="https://cdn.example.com/react@18.js"></script>
<!-- Каждый MFE рассчитывает на window.React -->
```
Работало, но привязывало все MFE к одной версии и требовало координации релизов.

**2. NPM-монорепо с общими пакетами**
Все MFE в одном репо, общие зависимости подняты через hoisting. Убивало независимость команд — изменение версии React требовало обновления всего монорепо.

**3. Полная изоляция (iframe)**
Каждый MFE — отдельный `<iframe>`. Максимальная изоляция, но огромные накладные расходы: каждый iframe тянул свой React, свой router, свою design system.

В **2020 году** Zack Jackson и команда Webpack представили **Module Federation Plugin** для Webpack 5. Идея была революционной: зависимости можно разделять в runtime, а не только на этапе сборки.

---

## Детальный разбор конфигурации Webpack MF

```js
// webpack.config.js — remote
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'catalogApp',          // (1) уникальное имя в глобальном scope
      filename: 'remoteEntry.js',  // (2) entry-point файл
      exposes: {                   // (3) публичный API
        './App': './src/App',
        './ProductCard': './src/components/ProductCard',
      },
      shared: {                    // (4) shared-зависимости
        react: {
          singleton: true,         // (5) только один экземпляр
          requiredVersion: '^18.0.0',
          eager: false,            // (6) не включать в entry chunk
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

### Поле `name` (1)

Имя становится глобальной переменной в браузере. `name: 'catalogApp'` создаёт `window.catalogApp`. Поэтому имена должны быть уникальны в рамках одного host. Используйте camelCase без пробелов и спецсимволов.

### Поле `filename` (2)

По умолчанию `remoteEntry.js`. Это файл-манифест, который host запрашивает первым. Он содержит:
- Список доступных модулей (exposes)
- Список требуемых shared-зависимостей с версиями
- Ссылки на реальные chunk-файлы

Размер обычно 2-10 KB. Его URL прописывается в конфиге host и должен совпадать с адресом деплоя remote.

### Поле `exposes` (3)

Словарь "публичное имя → реальный путь". Ключи принято начинать с `./` — это конвенция ES Module путей.

```js
exposes: {
  './App': './src/App.tsx',
  // Потребитель: import('catalogApp/App')
  //                      ^name  ^key
}
```

Всё что не в `exposes` — приватное. Внутренние утилиты, типы, вспомогательные компоненты не попадут наружу автоматически.

### Поле `shared` (4)

Здесь начинается магия Module Federation. Когда runtime видит, что и host, и remote объявили `react` в shared, он:
1. Проверяет, загружен ли уже совместимый `react` (через semver-сравнение версий)
2. Если да — отдаёт тот же экземпляр
3. Если нет — загружает новый, но помечает его как "доступный для последующих remotes"

### Флаг `singleton` (5)

Критически важен для React. React хранит состояние хуков в глобальном объекте своего модуля. Если два MFE загрузят разные экземпляры React — хуки будут работать с разными объектами, и вы увидите:

```
Error: Invalid hook call. Hooks can only be called inside of a function component.
```

`singleton: true` говорит МФ: "если версия несовместима — не загружай новую копию, используй ту что есть, и выведи предупреждение в консоль". Это компромисс между корректностью и изоляцией.

### Флаг `eager` (6)

По умолчанию `eager: false`. Это значит shared-зависимость загружается лениво. `eager: true` включает зависимость в entry chunk — полезно для избегания waterfall при инициализации, но увеличивает размер entry.

---

## Vite Plugin Federation: отличия

`@originjs/vite-plugin-federation` реализует те же концепции, но есть нюансы:

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
      // или расширенная форма:
      // shared: { react: { singleton: true, ... } }
    }),
  ],
  build: {
    target: 'esnext',  // ОБЯЗАТЕЛЬНО для ESM-чанков
    minify: false,     // рекомендуется для debugging
  },
  preview: {
    port: 3001,
    strictPort: true,  // не менять порт при занятом — упасть с ошибкой
  },
})
```

**Важное отличие**: Vite-плагин работает только с `build` (production preview). В `dev` режиме Module Federation не активен — нужно делать `vite build && vite preview` для каждого remote перед разработкой host. Это главное неудобство по сравнению с Webpack MF.

---

## Реальный пример: e-commerce платформа

Представим интернет-магазин с тремя командами:

### Структура репозиториев

```
apps/
  shell/          # host, загружает все remote
  catalog-mfe/    # каталог товаров
  cart-mfe/       # корзина
  user-mfe/       # профиль пользователя
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
      <Suspense fallback={<div>Загрузка...</div>}>
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

## Сравнение Webpack MF vs vite-plugin-federation

### Webpack Module Federation

**Преимущества:**
- Нативная поддержка (Webpack 5+), без плагинов
- Работает в dev-режиме с HMR для federated модулей (в Webpack 5.x)
- Зрелость: в продакшене с 2020, огромное сообщество
- Поддержка SSR (частичная, через NextFederationPlugin)
- Module Federation 2.0 (2024): улучшенные типы, runtime API

**Недостатки:**
- Медленная сборка по сравнению с Vite
- Сложная конфигурация
- Требует CommonJS или специальных адаптеров для ESM

### vite-plugin-federation

**Преимущества:**
- Vite: мгновенный dev-сервер
- Простая конфигурация, знакомый синтаксис
- Pure ESM output
- Активно развивается

**Недостатки:**
- Нет dev-режима для federated модулей (нужен `build && preview`)
- SSR поддержка ограничена
- Меньше Community и примеров
- Некоторые edge-cases (circular deps) хуже обработаны

### Module Federation 2.0

В 2024 году появился `@module-federation/core` — переработанное ядро, поддерживающее и Webpack, и Rspack, и (экспериментально) Vite. Ключевые улучшения:
- Типизированные manfests (TypeScript-first)
- Runtime API для динамической регистрации remotes
- Улучшенный shared-resolution алгоритм

---

## Подводные камни и best practices

### Подводный камень 1: версии shared должны совпадать семантически

Host объявляет `react@^17.0.0`, remote — `react@^18.0.0`. Module Federation не сможет найти совместимую версию (^17 не включает 18). При `singleton: true` будет предупреждение и загрузится версия host, remote может сломаться из-за несовместимого API.

📌 **Best practice**: договоритесь о мажорных версиях ключевых shared-зависимостей на уровне команды. Используйте `requiredVersion: '>=17.0.0 <19.0.0'` для более широкого диапазона.

### Подводный камень 2: TypeScript-типы для remote модулей

По умолчанию TypeScript не знает о типах из `catalogApp/App`. Нужен `declare module`:

```ts
// src/types/remotes.d.ts
declare module 'catalogApp/App' {
  import type { ComponentType } from 'react'
  const CatalogApp: ComponentType
  export default CatalogApp
}
```

Module Federation 2.0 решает это через автогенерацию типов, но в vite-plugin-federation нужно делать вручную или через `@mf-types-webpack-plugin`.

### Подводный камень 3: CSS изоляция

Remote компоненты не изолированы по CSS. Если remote подключает глобальные стили — они повлияют на host. Решения:
- CSS Modules (по умолчанию изолированы по hash)
- CSS-in-JS (styled-components, emotion)
- Shadow DOM (радикально, ломает многие паттерны)

### Best practice: version negotiation в prod

В production URL remoteEntry.js должен включать версию или хеш:
```
http://catalog.internal/v1.5.0/remoteEntry.js
# или
http://catalog.internal/remoteEntry.js?v=1.5.0
```

Это позволяет откатиться на предыдущую версию remote без изменения host.

### Best practice: fallback при недоступном remote

```tsx
const CatalogApp = React.lazy(() =>
  import('catalogApp/App').catch(() => ({
    default: () => <div>Каталог временно недоступен</div>
  }))
)
```

Всегда оборачивайте remote imports в try/catch или .catch(). Если remote-сервер упал — host не должен падать целиком.

### Best practice: local development

Для разработки host без запущенных remotes используйте fallback-модули:

```ts
// vite.config.ts (dev only)
remotes: {
  catalogApp: isDev
    ? 'catalogApp@http://localhost:3001/remoteEntry.js'
    : 'catalogApp@https://catalog.prod.example.com/remoteEntry.js',
}
```

И заглушки компонентов для оффлайн-разработки.
