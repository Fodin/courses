# Уровень 11: Server Components — Streaming и RSC Protocol

## Проблема: клиент качает слишком много JavaScript

Представьте интернет-магазин: страница товара показывает описание, отзывы, рекомендации. Всё это рендерится на клиенте. Пользователь загружает весь код библиотек форматирования, markdown-парсера, утилит для работы с датами — только чтобы показать статичный текст, который никогда не меняется без перезагрузки страницы.

React Server Components (RSC) решают это иначе: **компоненты, которые не нуждаются в интерактивности, рендерятся на сервере и передаются клиенту не как JavaScript, а как сериализованное описание UI**.

```
Классический SSR:
Сервер → HTML (статичная строка) + JS bundle (всё)
Клиент: парсит HTML, скачивает JS, гидрирует всё

RSC:
Сервер → HTML + RSC payload (JSON-like) + JS bundle (только client components)
Клиент: парсит HTML, получает RSC payload, гидрирует только Client Components
```

---

## RSC Wire Format: что летит по сети

RSC payload — это не HTML и не обычный JSON. Это **потоковый текстовый протокол**, где каждая строка — отдельный "чанк" с типом.

```
0:"$Sreact.suspense"
1:I{"id":"./src/Counter.tsx","chunks":["client1"],"name":"Counter","async":false}
2:{"children":"$L1","fallback":"Loading..."}
3:{"type":"div","props":{"className":"container"},"children":"Hello, World"}
```

Четыре типа строк:
- `M` (Module) — ссылка на клиентский модуль
- `I` — импорт клиентского компонента (client reference)
- `J` — JSON-сериализованный React element
- `S` — строковый токен (Suspense, Fragment и т.д.)

📌 Ключевая идея: серверные компоненты исчезают. В payload нет их кода — только их **вывод** (JSX как данные). Клиентские компоненты представлены как **дырки** (`$L1`, `$L2`) с ссылками на JS-модули.

---

## Server Components = чистые функции без состояния

Server Component — это async-функция, которая возвращает JSX. Она выполняется исключительно на сервере:

```tsx
// ProductPage.tsx (Server Component — нет 'use client')
async function ProductPage({ id }: { id: string }) {
  const product = await db.products.findById(id)  // прямой доступ к БД
  const reviews = await fetch(`/api/reviews/${id}`).then(r => r.json())

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <ReviewList reviews={reviews} />
      <AddToCartButton id={id} />  {/* Client Component */}
    </div>
  )
}
```

Что можно делать в Server Component:
- `async/await` — прямые запросы к БД, файловой системе, внешним API
- Передавать обычные данные как props клиентским компонентам
- Рендерить другие серверные компоненты

Чего нельзя:
- `useState`, `useEffect`, `useRef` и другие хуки — только в Client Components
- Обработчики событий (`onClick`, `onChange`)
- Browser API (`window`, `document`)

---

## Client Components: "дырки" в серверном дереве

Директива `'use client'` — это **граница** в дереве компонентов. Она говорит бандлеру (не рантайму!): "всё ниже этой границы — клиентский код".

```tsx
'use client'
// AddToCartButton.tsx

import { useState } from 'react'

export function AddToCartButton({ id }: { id: string }) {
  const [added, setAdded] = useState(false)
  return (
    <button onClick={() => setAdded(true)}>
      {added ? 'В корзине!' : 'Добавить в корзину'}
    </button>
  )
}
```

В RSC payload этот компонент выглядит как:
```
I{"id":"./AddToCartButton.tsx","chunks":["client-bundle-hash"],"name":"AddToCartButton"}
```

Клиент видит эту запись, скачивает соответствующий chunk, и вставляет реальный компонент на место "дырки".

---

## Streaming: страница приходит кусками

Вместо того чтобы ждать, пока сервер соберёт весь HTML, React использует `Transfer-Encoding: chunked` — HTTP-протокол для потоковой передачи данных.

```
Без streaming:
[==== сервер собирает всё ====] → [клиент получает сразу всё] → [рендер]

С streaming:
[сервер начал]
  → [чанк 1: header] → клиент рендерит header
  → [чанк 2: main content] → клиент рендерит main
  → [чанк 3: comments] → клиент рендерит comments
```

`<Suspense>` — это **точки потока**. Всё, что внутри Suspense, может прийти позже. React сначала отдаёт shell (то, что снаружи Suspense), а затем стримит содержимое Suspense-границ по мере готовности.

```tsx
// Сервер: shell отдаётся сразу, Comments — когда загрузятся
export default async function Page() {
  return (
    <main>
      <Header />                      {/* → в первом чанке */}
      <Suspense fallback={<Skeleton />}>
        <Comments />                  {/* → придёт позже */}
      </Suspense>
    </main>
  )
}
```

---

## Selective Hydration: React гидрирует умно

Традиционная гидрация — монолитная: React проходит всё дерево слева направо, блокируя интерактивность до завершения. С Selective Hydration всё иначе:

1. **Приоритет по взаимодействию**: если пользователь кликает на ещё не гидрированную область — React гидрирует её немедленно, прерывая гидрацию других частей
2. **Приоритеты событий**: `click` > `input` > `hover` > `scroll` (пассивный)
3. **Параллельность**: разные Suspense boundaries гидрируются независимо

```
Страница с 3 Suspense-границами:
[Header] [Sidebar] [Content]

Без клика: Header → Sidebar → Content (слева направо)
Клик на Content: Content гидрируется ПЕРВЫМ, затем Header → Sidebar
```

---

## 'use client' и 'use server': директивы для бандлера

Важно понимать: `'use client'` и `'use server'` — это **не runtime-флаги**. Это инструкции для бандлера (Next.js, Vite с RSC-плагином):

- `'use client'` → "создай отдельный chunk для этого модуля, сделай ссылку в RSC payload"
- `'use server'` → "создай серверную endpoint-функцию (Server Action), доступную через RPC-вызов"

В runtime Node.js не знает об этих директивах. Бандлер анализирует граф зависимостей и разделяет код ещё во время сборки.

---

## ⚠️ Распространённые ошибки новичков

### 1. Думать что Server Components — это SSR

```tsx
// ❌ Это не "просто SSR"
// SSR рендерит ВСЁ дерево как HTML строку на сервере
// RSC рендерит ТОЛЬКО серверные компоненты, сериализует в payload

// ✅ RSC = отдельная концепция:
// - Server Component никогда не выполняется на клиенте
// - Client Component может выполняться на обоих (SSR + hydration)
// - payload ≠ HTML строка
```

### 2. Передавать не-сериализуемые данные в Client Component

```tsx
// ❌ Функции нельзя сериализовать через RSC payload
function ServerComp() {
  const handler = () => console.log('click')
  return <ClientButton onClick={handler} />  // Error!
}

// ✅ Обработчики определяются внутри Client Component
// Из Server можно передать только: primitives, plain objects, arrays, JSX, Promises
function ServerComp() {
  return <ClientButton label="Click me" />
}
```

### 3. Импортировать Server Component внутри Client Component

```tsx
// ❌ Server Component нельзя импортировать в Client Component
'use client'
import { ServerComponent } from './Server'  // Error в RSC-окружении

// ✅ Передавать как children (composition pattern)
'use client'
function ClientWrapper({ children }) {
  return <div className="client">{children}</div>
}

// В Server Component:
<ClientWrapper>
  <ServerComponent />  {/* передаётся как JSX, не импортируется */}
</ClientWrapper>
```

---

## Резюме

```
Запрос страницы
    ↓
Сервер рендерит Server Components → RSC payload (streaming)
    ↓
Клиент получает HTML shell (первый чанк) → рендерит немедленно
    ↓
Клиент получает RSC chunks → восстанавливает React-дерево
    ↓
Selective Hydration: гидрирует Client Components по приоритету
    ↓
Пользователь взаимодействует → hydration приоритизируется
```

📌 Server Components не заменяют Client Components — они дополняют их. Правило простое: если компонент нуждается в состоянии или событиях — Client Component. Если нет — Server Component, и он бесплатно исчезнет из JS bundle.
