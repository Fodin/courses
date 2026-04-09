# Уровень 8: Коммуникация между MFE

## Проблема

Микрофронтенды изолированы по умолчанию — это преимущество. Но в реальном приложении MFE должны взаимодействовать: Catalog добавляет товар в Cart, Profile меняет язык для всех, Shell передаёт токен авторизации. Как организовать коммуникацию, сохраняя слабую связность?

## Ключевой принцип

**Минимальная связность + явные контракты.** MFE не должны знать друг о друге — только о событиях и данных, которыми обмениваются. Импорт кода одного MFE в другой — это нарушение изоляции.

## Паттерны коммуникации

### 1. Custom Events (pub/sub)

```typescript
// Catalog MFE — отправляет
window.dispatchEvent(new CustomEvent('catalog:add-to-cart', {
  detail: { productId: 'p42', qty: 1 }
}))

// Cart MFE — слушает
window.addEventListener('catalog:add-to-cart', (e) => {
  const { productId, qty } = (e as CustomEvent).detail
  cart.addItem(productId, qty)
})
```

**Когда использовать:** fire-and-forget уведомления, аналитика, реакция на действия пользователя без ожидания ответа.

**Плюсы:** полная развязка, MFE не знают друг о друге.
**Минусы:** нет гарантии доставки, сложно отлаживать цепочки событий.

### 2. Typed Event Bus

Обёртка над `window` с TypeScript-типизацией:

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

**Namespacing:** `mfe-name:action` — всегда указывает источник события.

### 3. Shared State (Zustand/Redux)

```typescript
// Shared store — в отдельном shared-пакете
const useCartStore = create<CartState>((set) => ({
  count: 0,
  addItem: (qty) => set((s) => ({ count: s.count + qty })),
}))

// Cart MFE — владелец, пишет
// Shell/Header — читает
const count = useCartStore((s) => s.count)
```

**Когда использовать:** данные нужны нескольким компонентам одновременно (счётчик корзины в шапке), UI-состояние требует синхронизации.

**Правило ownership:** только один MFE пишет в slice, остальные читают.

### 4. URL как состояние

```typescript
// Глобальные настройки — localStorage + storage event
localStorage.setItem('lang', 'ru')
window.dispatchEvent(new StorageEvent('storage', { key: 'lang', newValue: 'ru' }))

// Все MFE слушают
window.addEventListener('storage', (e) => {
  if (e.key === 'lang') updateLanguage(e.newValue)
})
```

**Когда использовать:** пользовательские настройки (язык, тема), состояние которое должно переживать перезагрузку страницы.

### 5. Props через Shell

```typescript
// Shell монтирует MFE с явными пропами
mountCatalogMFE(document.getElementById('catalog'), {
  authToken: session.token,
  userId: session.userId,
  onAddToCart: (item) => shell.handleAddToCart(item),
})
```

**Когда использовать:** auth-данные и конфиг от Shell к MFE при монтировании, колбеки для обратной связи.

### 6. Orchestrator Pattern

Shell как state machine для сложных флоу:

```typescript
// Shell управляет шагами
type CheckoutStep = 'cart' | 'payment' | 'confirm'
const [step, setStep] = useState<CheckoutStep>('cart')

// Каждый MFE получает только свои данные и сигнализирует о завершении
mountCheckoutMFE(container, { step, onComplete: () => setStep('payment') })
```

**Когда использовать:** многошаговые процессы (checkout, onboarding), строгая последовательность шагов.

## Анти-паттерны

❌ **Глобальные переменные**
```javascript
window.catalogState = { ... } // Catalog пишет
window.cartState.items.push(...) // Cart читает напрямую
```
Нет типизации, нет явного контракта, любой MFE может сломать состояние другого.

❌ **Прямые импорты между MFE**
```typescript
// cart/src/CartService.ts
import { catalogApi } from 'catalog/api' // НЕЛЬЗЯ!
```
Нарушает изоляцию, создаёт build-time зависимость.

❌ **Синхронная коммуникация через глобальный объект**
```javascript
window.mfeRegistry.catalog.addToCart(productId) // вызов метода другого MFE
```
Тесная связность, MFE знает о внутреннем API другого MFE.

## Как выбрать паттерн

| Сценарий | Паттерн |
|----------|---------|
| Уведомление без ожидания ответа | Custom Events |
| Данные нужны сразу нескольким | Shared State |
| Настройки между сессиями | URL / localStorage |
| Конфиг и токены от Shell | Props через Shell |
| Многошаговый процесс | Orchestrator |

## Типизация — обязательно

Любой контракт между MFE должен быть задокументирован в TypeScript. `EventMap` — это живая документация того, что происходит в системе.

```typescript
// packages/event-contracts/index.ts — один источник истины
export interface EventMap {
  'catalog:add-to-cart': { productId: string; qty: number }
  'cart:checkout-started': { total: number; items: number }
  'profile:logout': void
}
```
