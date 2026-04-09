# Уровень 6: Общие зависимости

## Проблема: N копий React в рантайме

Представьте ресторан, где каждый официант приносит свой собственный нож. Нелепо? Именно так работает микрофронтенд без шаринга зависимостей — каждый MFE тащит в браузер свою копию React, lodash, axios.

Для приложения с 4 MFE, каждый из которых использует React (45 KB) + react-dom (130 KB) + router (52 KB), это **875 KB** только на «инфраструктуру» — загружаемую четыре раза.

```
Shell      → react 45KB + react-dom 130KB + ...
Catalog    → react 45KB + react-dom 130KB + ...  ← дубль
Cart       → react 45KB + react-dom 130KB + ...  ← дубль
Profile    → react 45KB + react-dom 130KB + ...  ← дубль
```

Но это не только вопрос трафика. **Две копии React = два отдельных рантайма**, и они не знают друг о друге. Context от Shell не виден в Cart. Hooks ломаются. Это хуже, чем медленно — это неработоспособно.

## Import Maps: браузерный диспетчер модулей

Import Maps — нативный браузерный механизм (без бандлера!), позволяющий переопределить, откуда браузер загружает ES-модули.

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
  import React from 'react' // браузер резолвит → esm.sh/react@18.3.0
</script>
```

💡 Ключевое свойство: браузер кэширует URL. Все MFE, ссылающиеся на один URL, получают **один и тот же модуль из кэша**.

### Scopes — локальные переопределения

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

Scope `/app-legacy/` — как «местный закон»: только этот путь использует старый lodash, все остальные берут глобальный.

## Module Federation: `shared` конфигурация

Webpack Module Federation решает шаринг на уровне бандлера. Ключевые опции:

```js
// webpack.config.js (Shell — host)
new ModuleFederationPlugin({
  shared: {
    react: {
      singleton: true,       // только ОДНА копия в рантайме
      eager: true,           // загрузить сразу, не async
      requiredVersion: '^18.0.0',  // диапазон совместимых версий
    },
    'react-dom': {
      singleton: true,
      eager: true,
      requiredVersion: '^18.0.0',
    },
    zustand: {
      singleton: false,      // каждый MFE может иметь свою копию
      requiredVersion: '^4.0.0',
    }
  }
})
```

### singleton vs не-singleton

| | singleton: true | singleton: false |
|---|---|---|
| Копий в рантайме | 1 | по одной на MFE |
| Подходит для | React, React Context, Design System | утилиты без глобального состояния |
| Риск | version mismatch блокирует загрузку | дублирование кода |

### eager: true — когда нужно

По умолчанию shared-модули загружаются лениво (async chunk). Если Shell сам использует React в точке входа — нужен `eager: true`, иначе получим ошибку «Shared module is not available for eager consumption».

📌 Решение через async boundary:

```js
// bootstrap.js (отдельный файл)
import('./App') // <- динамический импорт создаёт async boundary

// index.js
import('./bootstrap') // точка входа только импортирует bootstrap
```

## Externals + CDN: классический подход

До Module Federation использовали `externals` в webpack + глобальные переменные через CDN:

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

❌ Минусы: загрязняет `window`, UMD-бандлы больше ESM, нет tree-shaking, CDN — единая точка отказа.

## Стратегия: что шарить, а что нет

```
✅ Шарить:
  - react, react-dom          (singleton обязателен)
  - react-router-dom          (нужен единый router context)
  - design system / UI kit    (общие компоненты, темы)
  - общие store (zustand/redux) если нужен единый стейт

❌ НЕ шарить:
  - бизнес-логика MFE         (нарушает изоляцию)
  - специфичные утилиты MFE   (версии могут разойтись)
  - dev-only зависимости      (не попадают в прод бандл)
```

## Конфликты версий

⚠️ Module Federation с `singleton: true` при version mismatch выдаёт предупреждение в консоль и может отказать в загрузке. Правило: все MFE должны указывать `requiredVersion` с semver-диапазоном, а не точной версией.

```js
// ❌ Хрупко — при любом патче обновление всех MFE
requiredVersion: '18.2.0'

// ✅ Гибко — принимает любой патч в пределах минора
requiredVersion: '^18.2.0'
```
