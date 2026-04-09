# Level 8: Communication Between MFEs

## The Problem

Microfrontends are isolated by default — that's the advantage. But in a real application, MFEs need to interact: Catalog adds items to Cart, Profile changes the language for everyone, Shell passes the auth token. How to organize communication while maintaining loose coupling?

## Key Principle

**Minimal coupling + explicit contracts.** MFEs should not know about each other — only about the events and data they exchange. Importing code from one MFE into another is a violation of isolation.

## Communication Patterns

### 1. Custom Events (pub/sub)

```typescript
// Catalog MFE — dispatches
window.dispatchEvent(new CustomEvent('catalog:add-to-cart', {
  detail: { productId: 'p42', qty: 1 }
}))

// Cart MFE — listens
window.addEventListener('catalog:add-to-cart', (e) => {
  const { productId, qty } = (e as CustomEvent).detail
  cart.addItem(productId, qty)
})
```

**When to use:** fire-and-forget notifications, analytics, reacting to user actions without waiting for a response.

**Pros:** complete decoupling, MFEs don't know about each other.
**Cons:** no delivery guarantee, hard to debug event chains.

### 2. Typed Event Bus

Wrapper over `window` with TypeScript typing:

```typescript
interface EventMap {
  'catalog:add-to-cart': { productId: string; qty: number }
  'cart:checkout-started': { total: number; items: number }
  'profile:logout': void
}

class EventBus {
  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    window.dispatchEvent(new CustomEvent(event, { detail: payload }))
  }

  on<K extends keyof EventMap>(
    event: K,
    handler: (payload: EventMap[K]) => void
  ): () => void {
    const fn = (e: Event) => handler((e as CustomEvent).detail)
    window.addEventListener(event, fn)
    return () => window.removeEventListener(event, fn)
  }
}

export const eventBus = new EventBus()
```

**Namespacing:** `mfe-name:action` — always specify the event source.

### 3. Shared State (Zustand/Redux)

```typescript
// Shared store — in a separate shared package
const useCartStore = create<CartState>((set) => ({
  count: 0,
  addItem: (qty) => set((s) => ({ count: s.count + qty })),
}))

// Cart MFE — owner, writes
// Shell/Header — reads
const count = useCartStore((s) => s.count)
```

**When to use:** data needed by multiple components simultaneously (cart counter in header), UI state requiring synchronization.

**Ownership rule:** only one MFE writes to a slice, others read.

### 4. URL as State

```typescript
// Global settings — localStorage + storage event
localStorage.setItem('lang', 'ru')
window.dispatchEvent(new StorageEvent('storage', { key: 'lang', newValue: 'ru' }))

// All MFEs listen
window.addEventListener('storage', (e) => {
  if (e.key === 'lang') updateLanguage(e.newValue)
})
```

**When to use:** user settings (language, theme), state that should survive page reload.

### 5. Props via Shell

```typescript
// Shell mounts MFE with explicit props
mountCatalogMFE(document.getElementById('catalog'), {
  authToken: session.token,
  userId: session.userId,
  onAddToCart: (item) => shell.handleAddToCart(item),
})
```

**When to use:** auth data and config from Shell to MFE on mount, callbacks for feedback.

### 6. Orchestrator Pattern

Shell as a state machine for complex flows:

```typescript
// Shell manages steps
type CheckoutStep = 'cart' | 'payment' | 'confirm'
const [step, setStep] = useState<CheckoutStep>('cart')

// Each MFE gets only its data and signals completion
mountCheckoutMFE(container, { step, onComplete: () => setStep('payment') })
```

**When to use:** multi-step processes (checkout, onboarding), strict step sequences.

## Anti-patterns

❌ **Global Variables**
```javascript
window.catalogState = { ... } // Catalog writes
window.cartState.items.push(...) // Cart reads directly
```
No typing, no explicit contract, any MFE can break another's state.

❌ **Direct Imports Between MFEs**
```typescript
// cart/src/CartService.ts
import { catalogApi } from 'catalog/api' // DON'T!
```
Violates isolation, creates build-time dependency.

❌ **Synchronous Communication via Global Object**
```javascript
window.mfeRegistry.catalog.addToCart(productId) // calling another MFE's method
```
Tight coupling, MFE knows about another MFE's internal API.

## How to Choose a Pattern

| Scenario | Pattern |
|----------|---------|
| Notification without waiting for response | Custom Events |
| Data needed by multiple simultaneously | Shared State |
| Settings between sessions | URL / localStorage |
| Config and tokens from Shell | Props via Shell |
| Multi-step process | Orchestrator |

## Typing — Required

Any contract between MFEs must be documented in TypeScript. `EventMap` is living documentation of what happens in the system.

```typescript
// packages/event-contracts/index.ts — single source of truth
export interface EventMap {
  'catalog:add-to-cart': { productId: string; qty: number }
  'cart:checkout-started': { total: number; items: number }
  'profile:logout': void
}
```
