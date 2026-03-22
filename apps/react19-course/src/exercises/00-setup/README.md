# Уровень 0: Setup — Обновление и Breaking Changes

## Что нового в React 19

React 19 — это мажорный релиз, который содержит множество новых возможностей и ряд breaking changes. Основные нововведения:

- **Новый хук `use()`** — чтение промисов и контекстов с поддержкой Suspense
- **Actions** — новый паттерн для обработки форм (`useActionState`, `useFormStatus`)
- **`useOptimistic`** — хук для оптимистичных обновлений UI
- **ref как обычный prop** — больше не нужен `forwardRef`
- **ref cleanup functions** — возврат функции очистки из ref callback
- **Document Metadata** — нативная поддержка `<title>`, `<meta>`, `<link>` в компонентах
- **Улучшенный Suspense** — поддержка async transitions
- **Server Components** и **Server Actions** — серверные компоненты и серверные действия

---

## Как обновиться до React 19

### Шаг 1: Обновите пакеты

```bash
# npm
npm install react@19 react-dom@19
npm install -D @types/react@19 @types/react-dom@19

# yarn
yarn add react@19 react-dom@19
yarn add -D @types/react@19 @types/react-dom@19

# pnpm
pnpm add react@19 react-dom@19
pnpm add -D @types/react@19 @types/react-dom@19
```

### Шаг 2: Обновите связанные зависимости

- `eslint-plugin-react-hooks` → v5+
- `@testing-library/react` → v16+
- Если используете Next.js → v15+
- Если используете React Router → v7+

### Шаг 3: Запустите codemod (рекомендуется)

```bash
npx codemod@latest react/19/migration-recipe
```

---

## react-codemod: автоматические миграции

React предоставляет официальные codemod-скрипты для автоматической миграции. Они помогают обновить ваш код без ручной правки каждого файла.

### Что делает codemod:

1. **`ReactDOM.render` → `createRoot`** — обновляет точку входа
2. **String refs → callback refs / `createRef`** — убирает строковые рефы
3. **`defaultProps` → default parameters** — для функциональных компонентов
4. **`forwardRef` → ref as prop** — убирает обёртку `forwardRef`
5. **Legacy Context → `createContext`** — обновляет устаревший контекст

### Как запустить:

```bash
# Запустить полный рецепт миграции
npx codemod@latest react/19/migration-recipe

# Или запустить конкретный codemod
npx codemod@latest react/19/replace-reactdom-render
npx codemod@latest react/19/replace-string-ref
npx codemod@latest react/19/replace-default-props
```

**Важно:** всегда проверяйте результат codemod перед коммитом. Автоматическая миграция не всегда идеальна.

---

## Breaking Changes: удалённые API

### Компоненты

| Удалено | Замена |
|---------|--------|
| `defaultProps` для функциональных компонентов | ES6 default parameters |
| `propTypes` | TypeScript |
| String refs (`ref="myRef"`) | `useRef` / callback refs |
| Legacy Context (`contextTypes`, `childContextTypes`) | `createContext` / `useContext` |

### ReactDOM

| Удалено | Замена |
|---------|--------|
| `ReactDOM.render()` | `createRoot().render()` |
| `ReactDOM.hydrate()` | `hydrateRoot()` |
| `ReactDOM.unmountComponentAtNode()` | `root.unmount()` |
| `ReactDOM.findDOMNode()` | `useRef` |

### Типы (TypeScript)

| Удалено | Замена |
|---------|--------|
| Неявный `children` в `FC` | Явно указывать `children: ReactNode` |
| `useRef()` без аргумента | `useRef(null)` или `useRef(undefined)` |
| `ReactElement` type parameter | Используйте `ReactElement<P, T>` |

### Другое

| Удалено | Замена |
|---------|--------|
| `react-test-renderer` | `@testing-library/react` |
| `act` из `react-dom/test-utils` | `act` из `react` |
| UMD-сборки | ESM + CDN (esm.sh) |

---

## Новые предупреждения и Strict Mode

React 19 добавляет новые предупреждения в Strict Mode:

1. **Предупреждение о string refs** — React теперь выводит ошибку, а не предупреждение
2. **Предупреждение о Legacy Context** — ошибка вместо предупреждения
3. **Двойной вызов эффектов** — Strict Mode продолжает вызывать эффекты дважды в dev-режиме
4. **Предупреждение о `key` как prop** — доступ к `this.props.key` теперь вызывает предупреждение

---

## Дополнительные ресурсы

- [React 19 Blog Post](https://react.dev/blog/2024/12/05/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [Codemod CLI](https://github.com/codemod-com/codemod)

---

## Что дальше?

В следующем уровне вы изучите:
- Новый JSX transform (обязателен в React 19)
- ref как обычный prop (без `forwardRef`)
- ref cleanup functions
