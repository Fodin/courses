# Level 6: Server Components

## Introduction

React Server Components (RSC) are one of the biggest additions in React 19. These are components that render **on the server** and send the client ready-made HTML instead of JavaScript.

> **Important:** RSC requires a server framework (Next.js, Remix, etc.). In this level we study the concepts and simulate the behavior.

---

## Server vs Client Components

### Server Components (default)

```tsx
// This is a server component (default in Next.js App Router)
async function ProductList() {
  const products = await db.query('SELECT * FROM products')
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  )
}
```

**Can:**
- Access the database directly
- Read the file system
- Use server-side APIs
- Use `async/await` in the component body

**Cannot:**
- Use `useState`, `useEffect`, `useRef`
- Handle events (`onClick`, `onChange`)
- Use browser APIs (`window`, `localStorage`)

### Client Components

```tsx
'use client'

import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

Marked with the `'use client'` directive on the first line of the file.

---

## The 'use client' Directive

```tsx
'use client'  // ← Must be the first line of the file

import { useState } from 'react'

export function InteractiveWidget() {
  const [open, setOpen] = useState(false)
  // ...
}
```

### Rules

1. `'use client'` goes on the **first line** of the file (before imports)
2. All components in that file become client components
3. Imported child components also become client components
4. A server component can render a client component, but not the other way around (directly)

---

## Server Actions

Server Actions allow calling server-side functions directly from client code:

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
      <button type="submit">Add to cart</button>
    </form>
  )
}
```

### Key characteristics

- Functions marked with `'use server'` execute on the server
- Arguments are serialized automatically
- Can be used as a form `action` or called directly
- Integrates with `useActionState` and `useFormStatus`

---

## Composition Patterns

### Server component renders a client component

```tsx
// ServerPage.tsx (server)
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

### Passing server content as children

```tsx
// ClientLayout.tsx
'use client'
export function ClientLayout({ children }) {
  const [sidebar, setSidebar] = useState(true)
  return (
    <div>
      {sidebar && <Sidebar />}
      <main>{children}</main>  {/* children can be server-rendered */}
    </div>
  )
}

// Page.tsx (server)
function Page() {
  return (
    <ClientLayout>
      <ServerContent />  {/* Server component as children */}
    </ClientLayout>
  )
}
```

---

## Summary

| Concept          | Description                                    |
|------------------|------------------------------------------------|
| Server Component | Rendered on the server, no JS on the client    |
| `'use client'`   | Marks a client component                       |
| `'use server'`   | Marks a server function                        |
| Server Action    | A server function callable from the client     |
