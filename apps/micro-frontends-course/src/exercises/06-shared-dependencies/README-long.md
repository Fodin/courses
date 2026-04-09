# Уровень 6: Общие зависимости — расширенная теория

## Почему дублирование зависимостей — это катастрофа

### Два рантайма React = разорванный контекст

React Context работает через замыкание на экземпляр React. Если Shell создаёт `AuthContext` с копией React v1, а Cart пытается его читать через свою копию React v2 — context просто не найдётся. `useContext` вернёт `undefined`.

```
❌ Без шаринга:

Shell (React instance A)
  └── AuthContext.Provider value={user}

Cart (React instance B)
  └── useContext(AuthContext)  ← context из instance A, читается instance B
       → undefined             ← провал
```

Это не гипотетический сценарий — это реальная ошибка, которую каждый разработчик микрофронтендов встречает хотя бы раз.

### Проблема с хуками

React хуки работают через глобальный диспетчер хуков, хранящийся в экземпляре React. При двух копиях React вы получите «Invalid hook call» — самую загадочную ошибку для тех, кто не знает о дублировании.

### Размер бандла

Для 4 MFE с React + react-dom + router:

```
Без шаринга:  (45 + 130 + 52) × 4 = 908 KB
С шарингом:   (45 + 130 + 52) × 1 = 227 KB

Экономия: 681 KB (75%)
```

И это только три библиотеки. С полноценным design-system экономия может достигать мегабайт.

## Import Maps в деталях

### Спецификация и поддержка

Import Maps — часть спецификации HTML (WHATWG). Поддерживается нативно:
- Chrome 89+ (март 2021)
- Firefox 108+ (декабрь 2022)
- Safari 16.4+ (март 2023)

Для старых браузеров: [es-module-shims](https://github.com/guybedford/es-module-shims) — полифил, который парсит и реализует import maps в браузерах без поддержки.

### Алгоритм резолюции

```
LR
    A["import 'react'"] --> B{Есть в importmap?}
    B -- "Да" --> C["Загрузить по URL из imports"]
    B -- "Нет" --> D{Есть подходящий scope?}
    D -- "Да" --> E["Загрузить по URL из scope"]
    D -- "Нет" --> F["Ошибка: bare specifier не разрешён"]
    C --> G[Кэш браузера]
    E --> G
```

### Генераторы import maps

Ручное поддержание import maps становится неудобным при большом числе зависимостей. Существуют генераторы:

- **[ImportMap.dev](https://generator.jspm.io/)** — визуальный генератор от JSPM
- **[jspm CLI](https://jspm.org/getting-started)** — `jspm install react react-dom`
- **[import-map-deployer](https://github.com/single-spa/import-map-deployer)** — сервер для динамического обновления import maps в рантайме (от single-spa)

`import-map-deployer` позволяет обновлять import map через API без передеплоя shell:

```bash
# Деплой новой версии Catalog MFE
PATCH /import-map.json
{
  "imports": {
    "@company/mfe-catalog": "https://cdn.company.com/catalog/v2.3.1/main.js"
  }
}
```

## Module Federation shared — полный гайд

### Автоматическое определение shared

MF 2.x умеет автоматически определять shared из package.json:

```js
const { dependencies } = require('./package.json')

new ModuleFederationPlugin({
  shared: {
    ...dependencies, // все зависимости — shared с текущей версией
    react: { singleton: true, eager: true, requiredVersion: dependencies.react },
    'react-dom': { singleton: true, eager: true, requiredVersion: dependencies['react-dom'] },
  }
})
```

⚠️ Осторожно: шарить абсолютно все зависимости — плохая идея. Слишком много переговоров в рантайме замедляет инициализацию.

### Version negotiation в рантайме

Когда несколько MFE объявляют одну библиотеку с разными версиями, MF проводит «переговоры»:

```
Shell:   react singleton ^18.0.0, установлен 18.3.0
Catalog: react singleton ^18.0.0, установлен 18.2.0
Cart:    react singleton ^18.0.0, установлен 18.3.0

Результат: загружается 18.3.0 (максимальная совместимая)
```

Если Cart объявит `^17.0.0` — singleton конфликт, в консоль пойдёт warning, и может загрузиться две копии.

### eager и async boundary

```
❌ Проблема:
index.js → import './App' (статический)
         → App использует shared React
         → React ещё не загружен → ошибка

✅ Решение:
index.js → import('./bootstrap') (динамический)
bootstrap.js → import './App'   (статический)
```

Это называется «async boundary» — граница, после которой MF успевает договориться о версиях и загрузить shared-модули.

## Стратегия shared: архитектурные решения

### Что точно шарить

```
1. React, React DOM
   Причина: singleton обязателен, иначе сломаются context и hooks

2. Роутер (react-router, vue-router)
   Причина: единая история навигации, единый location

3. Design System / UI Kit
   Причина: консистентность визуала, избежание дублирования

4. State manager (если используется глобальный)
   Причина: единый store доступен всем MFE
```

### Что НЕ шарить

```
1. Бизнес-логика конкретного MFE
   Причина: утечка инкапсуляции, прямая связность

2. Internal utils и helpers
   Причина: создают неявные зависимости между MFE

3. Редко используемые библиотеки
   Причина: накладные расходы на negotiation не оправданы

4. Библиотеки с часто меняющимися версиями
   Причина: постоянные конфликты и синхронизация обновлений
```

### Диаграмма решения

```
LR
    A["Библиотека X"] --> B{Используется в 2+ MFE?}
    B -- "Нет" --> C[Не шарить]
    B -- "Да" --> D{Имеет глобальное состояние / context?}
    D -- "Да" --> E["Шарить: singleton: true"]
    D -- "Нет" --> F{Размер > 30KB?}
    F -- "Нет" --> C
    F -- "Да" --> G["Шарить: singleton: false"]
```

## Externals + CDN: когда это оправдано

Externals — классический паттерн, живёт до сих пор в legacy-проектах и в сценариях без Module Federation.

### Плюсы CDN externals

- Простота: понятно без знания MF
- CDN кэшируется на уровне браузера (shared cache, хотя в modern browsers уже нет)
- Работает без изменений бандлера

### Минусы CDN externals

- UMD-бандлы тяжелее ESM (нет tree-shaking)
- Загрязнение `window` глобальными переменными
- CDN = единая точка отказа
- Нет version negotiation — все должны синхронно обновиться

### Современная альтернатива

```html
<!-- Вместо CDN UMD используйте ESM + importmap -->
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.3.0"
  }
}
</script>
```

ESM через importmap даёт кэширование без загрязнения `window` и с поддержкой tree-shaking.

## Мониторинг shared зависимостей

Как понять, что шаринг работает в продакшне?

1. **Chrome DevTools → Network**: найдите `react.js` — он должен загружаться один раз
2. **webpack-bundle-analyzer**: отсутствие React в бандлах MFE при правильном шаринге
3. **Консоль браузера**: MF выводит предупреждения о version mismatch в dev-режиме

```js
// В коде: проверка, какая версия React используется
console.log(React.version) // должно быть одинаково во всех MFE
```

## ⚠️ Типичные ошибки новичков

### 1. Singleton без eager в точке входа

```js
// ❌ Ошибка: Shell использует React в index.js, но не eager
shared: {
  react: { singleton: true } // eager: false по умолчанию
}

// ✅ Правильно: eager + async boundary
shared: {
  react: { singleton: true, eager: true }
}
// + разделить index.js и bootstrap.js
```

### 2. Точные версии вместо диапазонов

```js
// ❌ Любое обновление любого MFE = обновление всех
requiredVersion: '18.2.0'

// ✅ Патчи и минорные обновления совместимы
requiredVersion: '^18.0.0'
```

### 3. Шаринг слишком мелких пакетов

```js
// ❌ Накладные расходы на negotiation > выгода от шаринга
shared: {
  'classnames': { singleton: false }, // 1.5 KB — не стоит шарить
  'uuid': { singleton: false },        // 5 KB — сомнительно
}
```

### 4. Import Map не в начале head

```html
<!-- ❌ Слишком поздно — модули уже начали резолвиться -->
<script type="module" src="./app.js"></script>
<script type="importmap">...</script>

<!-- ✅ Правильно: importmap до всех module script -->
<script type="importmap">...</script>
<script type="module" src="./app.js"></script>
```
