# Уровень 6: Server Components

## Введение

React Server Components (RSC) — одно из крупнейших нововведений React 19. Это компоненты, которые рендерятся **на сервере** и отправляют клиенту готовый HTML вместо JavaScript.

> **Важно:** RSC требуют серверного фреймворка (Next.js, Remix и др.). В этом уровне мы изучаем концепции и симулируем поведение.

---

## Серверные vs Клиентские компоненты

### Серверные компоненты (по умолчанию)

```tsx
// Это серверный компонент (по умолчанию в Next.js App Router)
async function ProductList() {
  const products = await db.query('SELECT * FROM products')
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  )
}
```

**Могут:**
- Обращаться к базе данных напрямую
- Читать файловую систему
- Использовать серверные API
- Использовать `async/await` в теле компонента

**Не могут:**
- Использовать `useState`, `useEffect`, `useRef`
- Обрабатывать события (`onClick`, `onChange`)
- Использовать браузерные API (`window`, `localStorage`)

### Клиентские компоненты

```tsx
'use client'

import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

Маркируются директивой `'use client'` в первой строке файла.

---

## Директива 'use client'

```tsx
'use client'  // ← Обязательно первая строка файла

import { useState } from 'react'

export function InteractiveWidget() {
  const [open, setOpen] = useState(false)
  // ...
}
```

### Правила

1. `'use client'` ставится в **первой строке** файла (до импортов)
2. Все компоненты в этом файле становятся клиентскими
3. Импортируемые дочерние компоненты тоже становятся клиентскими
4. Серверный компонент может рендерить клиентский, но не наоборот (напрямую)

---

## Server Actions

Server Actions позволяют вызывать серверные функции прямо из клиентского кода:

```tsx
// actions.ts
'use server'

export async function addToCart(productId: string) {
  await db.cart.add({ productId, userId: getCurrentUser() })
  revalidatePath('/cart')
}
```

```tsx
// CartButton.tsx
'use client'

import { addToCart } from './actions'

function CartButton({ productId }) {
  return (
    <form action={addToCart.bind(null, productId)}>
      <button type="submit">В корзину</button>
    </form>
  )
}
```

### Ключевые особенности

- Функции с `'use server'` выполняются на сервере
- Автоматическая сериализация аргументов
- Можно использовать в form `action` или вызывать напрямую
- Интеграция с `useActionState` и `useFormStatus`

---

## Паттерны композиции

### Серверный компонент рендерит клиентский

```tsx
// ServerPage.tsx (серверный)
import { ClientSidebar } from './ClientSidebar'

async function ServerPage() {
  const data = await fetchData()
  return (
    <div>
      <h1>{data.title}</h1>
      <ClientSidebar items={data.items} />
    </div>
  )
}
```

### Передача серверного контента как children

```tsx
// ClientLayout.tsx
'use client'
export function ClientLayout({ children }) {
  const [sidebar, setSidebar] = useState(true)
  return (
    <div>
      {sidebar && <Sidebar />}
      <main>{children}</main>  {/* children может быть серверным */}
    </div>
  )
}

// Page.tsx (серверный)
function Page() {
  return (
    <ClientLayout>
      <ServerContent />  {/* Серверный компонент как children */}
    </ClientLayout>
  )
}
```

---

## Итого

| Концепция | Описание |
|-----------|----------|
| Server Component | Рендерится на сервере, нет JS на клиенте |
| `'use client'` | Маркирует клиентский компонент |
| `'use server'` | Маркирует серверную функцию |
| Server Action | Серверная функция, вызываемая с клиента |
