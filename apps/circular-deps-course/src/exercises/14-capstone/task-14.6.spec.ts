import { importsRespectLayers, noDeepImport, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 14.6 (сложное) — Тема B «FSD-срез без циклов».
 *
 * Дано: мини-приложение «корзина» из 8 модулей на 4 слоях (shared, entities,
 * features, widgets) с ТРЕМЯ нарушениями сразу:
 *  1) `entities/cart/model/store.ts` импортирует `getCheckoutTotal` из
 *     `features/checkout/model/store` — нарушение направления слоёв
 *     (entities не должен знать про features) И глубокий импорт (в обход
 *     public API фичи). Это же и замыкает цикл: checkout уже легально
 *     импортирует cart, а cart в ответ импортирует checkout.
 *  2) `features/checkout/model/store.ts` импортирует `getProduct` из
 *     `entities/product/model/store` напрямую — глубокий импорт в обход
 *     public API сущности.
 *  3) `widgets/cart-summary/index.ts` импортирует `getCheckoutTotal` из
 *     `features/checkout/model/store` напрямую — тоже глубокий импорт.
 *
 * Задача: собрать корректную FSD-архитектуру без циклов — убрать обратную
 * зависимость сущности от фичи и заменить все три глубоких импорта на
 * импорты через public API (`index.ts`) соответствующих слайсов.
 */

const formatFile = `export function formatPrice(amount: number): string {
  return \`$\${amount.toFixed(2)}\`
}
`

const productStore = `export interface Product {
  id: string
  price: number
}

const products: Product[] = [
  { id: 'p1', price: 20 },
  { id: 'p2', price: 15 },
]

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id)
}
`

const productIndex = `export { getProduct } from './model/store'
export type { Product } from './model/store'
`

const cartStoreStart = `import { getCheckoutTotal } from '@/features/checkout/model/store'

export interface CartItem {
  productId: string
  qty: number
}

const items: CartItem[] = [{ productId: 'p1', qty: 2 }]

export function getCartItems(): CartItem[] {
  return items
}

// TODO: entities не должен знать про features. Удалите импорт
// getCheckoutTotal и функцию ниже — логировать итог обязана вызывающая
// сторона (features), а не сама сущность корзины. Это единственная причина
// цикла entities/cart <-> features/checkout.
export function logCartTotal(): void {
  console.log('checkout total:', getCheckoutTotal())
}
`

const cartStoreSolution = `export interface CartItem {
  productId: string
  qty: number
}

const items: CartItem[] = [{ productId: 'p1', qty: 2 }]

export function getCartItems(): CartItem[] {
  return items
}
`

const cartIndex = `export { getCartItems } from './model/store'
export type { CartItem } from './model/store'
`

const checkoutStoreStart = `import { getCartItems } from '@/entities/cart'
import { getProduct } from '@/entities/product/model/store'

// TODO: импортируйте getProduct из '@/entities/product' (публичный API
// сущности), а не из внутреннего model/store — это глубокий импорт.
export function getCheckoutTotal(): number {
  return getCartItems().reduce((sum, item) => {
    const product = getProduct(item.productId)
    return sum + (product ? product.price * item.qty : 0)
  }, 0)
}
`

const checkoutStoreSolution = `import { getCartItems } from '@/entities/cart'
import { getProduct } from '@/entities/product'

export function getCheckoutTotal(): number {
  return getCartItems().reduce((sum, item) => {
    const product = getProduct(item.productId)
    return sum + (product ? product.price * item.qty : 0)
  }, 0)
}
`

const checkoutIndex = `export { getCheckoutTotal } from './model/store'
`

const cartSummaryStart = `import { getCheckoutTotal } from '@/features/checkout/model/store'
import { formatPrice } from '@/shared/lib/format'

// TODO: импортируйте getCheckoutTotal из '@/features/checkout' (публичный
// API фичи), а не из внутреннего model/store — это глубокий импорт.
export function renderCartSummary(): string {
  return \`Total: \${formatPrice(getCheckoutTotal())}\`
}
`

const cartSummarySolution = `import { getCheckoutTotal } from '@/features/checkout'
import { formatPrice } from '@/shared/lib/format'

export function renderCartSummary(): string {
  return \`Total: \${formatPrice(getCheckoutTotal())}\`
}
`

export const spec: LabSpec = {
  id: '14.6',
  title: 'Задание 14.6 — FSD-срез без циклов: собрать архитектуру целиком (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/shared/lib/format.ts', content: formatFile, role: 'readonly' },
    { path: 'src/entities/product/model/store.ts', content: productStore, role: 'readonly' },
    { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' },
    { path: 'src/entities/cart/model/store.ts', content: cartStoreStart, role: 'editable' },
    { path: 'src/entities/cart/index.ts', content: cartIndex, role: 'readonly' },
    {
      path: 'src/features/checkout/model/store.ts',
      content: checkoutStoreStart,
      role: 'editable',
    },
    { path: 'src/features/checkout/index.ts', content: checkoutIndex, role: 'readonly' },
    { path: 'src/widgets/cart-summary/index.ts', content: cartSummaryStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/shared/lib/format.ts', content: formatFile, role: 'readonly' },
    { path: 'src/entities/product/model/store.ts', content: productStore, role: 'readonly' },
    { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' },
    { path: 'src/entities/cart/model/store.ts', content: cartStoreSolution, role: 'editable' },
    { path: 'src/entities/cart/index.ts', content: cartIndex, role: 'readonly' },
    {
      path: 'src/features/checkout/model/store.ts',
      content: checkoutStoreSolution,
      role: 'editable',
    },
    { path: 'src/features/checkout/index.ts', content: checkoutIndex, role: 'readonly' },
    { path: 'src/widgets/cart-summary/index.ts', content: cartSummarySolution, role: 'editable' },
  ],
  checks: [noRuntimeCycles(), importsRespectLayers(), noDeepImport()],
}
