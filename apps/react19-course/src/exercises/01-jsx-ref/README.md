# Уровень 1: Новый JSX Transform и ref как prop

## Новый JSX Transform

### История вопроса

До React 17, когда вы писали JSX, он компилировался в вызовы `React.createElement()`:

```tsx
// Ваш код
function App() {
  return <div>Hello</div>
}

// Компилировался в
function App() {
  return React.createElement('div', null, 'Hello')
}
```

Именно поэтому **было обязательно** импортировать React в каждом файле с JSX:

```tsx
import React from 'react' // Обязательно в React 16!
```

### Новый JSX Transform (React 17+)

Начиная с React 17, появился новый JSX transform, который не требует `React` в области видимости:

```tsx
// Ваш код (React 17+)
function App() {
  return <div>Hello</div>
}

// Компилируется в
import { jsx as _jsx } from 'react/jsx-runtime'
function App() {
  return _jsx('div', { children: 'Hello' })
}
```

Импорт `jsx-runtime` добавляется автоматически компилятором (Babel, TypeScript, SWC).

### В React 19

В React 19 новый JSX transform **обязателен**. Старый transform через `React.createElement` больше не поддерживается.

**Что нужно сделать:**
1. Убрать `import React from 'react'` из файлов (если React не используется напрямую)
2. Импортировать только то, что нужно: `import { useState, useEffect } from 'react'`

```tsx
// До (React 16-18)
import React, { useState } from 'react'

// После (React 19)
import { useState } from 'react'
```

### Настройка в tsconfig.json

Убедитесь, что в `tsconfig.json` установлен правильный `jsx`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"  // Новый transform
    // НЕ "jsx": "react" — это старый transform
  }
}
```

---

## ref как обычный prop

### Проблема в React 18

В React 18, чтобы передать `ref` в дочерний функциональный компонент, нужно было использовать `forwardRef`:

```tsx
// React 18: Нужен forwardRef
import { forwardRef, useRef } from 'react'

const FancyInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} {...props} />
})

FancyInput.displayName = 'FancyInput'

// Использование
function Parent() {
  const inputRef = useRef<HTMLInputElement>(null)
  return <FancyInput ref={inputRef} />
}
```

### Решение в React 19

В React 19, `ref` — это **обычный prop**. Никакой обёртки `forwardRef` не нужно:

```tsx
// React 19: ref как обычный prop
import { type Ref, useRef } from 'react'

function FancyInput({ ref, ...props }: { ref?: Ref<HTMLInputElement> } & InputProps) {
  return <input ref={ref} {...props} />
}

// Использование — точно такое же
function Parent() {
  const inputRef = useRef<HTMLInputElement>(null)
  return <FancyInput ref={inputRef} />
}
```

### Преимущества

1. **Меньше бойлерплейта** — не нужно оборачивать в `forwardRef`
2. **Не нужен `displayName`** — именованные функции уже имеют имя
3. **Понятнее** — `ref` это просто prop, никакой магии
4. **Лучше для TypeScript** — типы props проще

---

## ref cleanup function

### Старый паттерн (React 18)

В React 18, ref callback вызывался с `null`, когда элемент удалялся из DOM:

```tsx
// React 18: ref callback
<input
  ref={(node) => {
    if (node) {
      // Элемент добавлен в DOM
      node.focus()
    } else {
      // node === null → элемент удалён из DOM
      console.log('cleanup')
    }
  }}
/>
```

### Новый паттерн (React 19)

В React 19 можно возвращать **cleanup-функцию** из ref callback:

```tsx
// React 19: ref cleanup function
<input
  ref={(node) => {
    // Setup: элемент добавлен в DOM
    node.focus()

    const observer = new IntersectionObserver(callback)
    observer.observe(node)

    // Cleanup: вызывается при размонтировании
    return () => {
      observer.disconnect()
    }
  }}
/>
```

### Преимущества cleanup-функций

1. **Знакомый паттерн** — как `useEffect` cleanup
2. **Доступ к node** — в cleanup-функции доступен `node` через замыкание
3. **Чистый код** — нет условной логики `if (node) / else`

### Примеры использования

```tsx
// Подписка на IntersectionObserver
<div
  ref={(node) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('Элемент виден!')
        }
      })
    })
    observer.observe(node)
    return () => observer.disconnect()
  }}
/>

// Подписка на ResizeObserver
<div
  ref={(node) => {
    const observer = new ResizeObserver((entries) => {
      console.log('Размер изменился:', entries[0].contentRect)
    })
    observer.observe(node)
    return () => observer.disconnect()
  }}
/>
```

---

## Миграция с forwardRef

### Пошаговая инструкция

**Шаг 1:** Убрать `forwardRef` обёртку

```tsx
// До
const MyInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <input ref={ref} {...props} />
})

// После
function MyInput({ ref, ...props }: Props & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

**Шаг 2:** Убрать `displayName` (если использовали)

```tsx
// До
MyInput.displayName = 'MyInput'  // Убрать

// После — не нужно, функция уже именованная
```

**Шаг 3:** Обновить типы (если нужно)

```tsx
// До
import { forwardRef, Ref } from 'react'

// После
import { type Ref } from 'react'
```

### Codemod для автоматической миграции

```bash
npx codemod@latest react/19/replace-forward-ref
```

---

## Дополнительные ресурсы

- [React 19: ref as a prop](https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop)
- [React 19: ref cleanup functions](https://react.dev/blog/2024/12/05/react-19#ref-cleanup-functions)
- [New JSX Transform](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)

---

## Что дальше?

В следующем уровне вы изучите:
- Новый хук `use()` для чтения промисов
- `use(Context)` вместо `useContext`
- Условный вызов `use()` (в отличие от других хуков)
- Паттерн Suspense + ErrorBoundary + `use()`
