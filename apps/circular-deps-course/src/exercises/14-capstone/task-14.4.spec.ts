import { importsRespectLayers, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 14.4 (простое) — Тема B «FSD-срез без циклов».
 *
 * Дано: вертикальный срез `entities/product` -> `features/add-to-cart` ->
 * `widgets/product-card`. `entities/product/index.ts` (public API сущности)
 * зачем-то импортирует `addToCart` из `features/add-to-cart` — сущность не
 * должна знать о фиче. Это и нарушение направления слоёв, и цикл: фича уже
 * легально импортирует сущность (вниз по стеку), а сущность импортирует
 * фичу в ответ (вверх).
 *
 * Задача: убрать лишний импорт из `entities/product/index.ts` — сущность не
 * должна знать о существовании `features/add-to-cart`.
 */

const productStore = `export interface Product {
  id: string
  price: number
}

const products: Product[] = [{ id: 'p1', price: 10 }]

export function getProduct(id: string): Product | undefined {
  return products.find(p => p.id === id)
}
`

const productIndexStart = `import { addToCart } from '@/features/add-to-cart'

export { getProduct } from './model/store'
export type { Product } from './model/store'

// TODO: entities не должен знать про features. Уберите импорт addToCart
// выше и строку console.log ниже — это единственная причина цикла
// entities/product <-> features/add-to-cart.
console.log('add-to-cart handler wired:', typeof addToCart)
`

const productIndexSolution = `export { getProduct } from './model/store'
export type { Product } from './model/store'
`

const addToCartStore = `import { getProduct } from '@/entities/product'

export function addToCartAction(productId: string): string {
  const product = getProduct(productId)
  return product ? \`added \${product.id}\` : 'not found'
}
`

const addToCartIndex = `export { addToCartAction as addToCart } from './model/store'
`

const productCardIndex = `import { getProduct } from '@/entities/product'
import { addToCart } from '@/features/add-to-cart'

export function renderProductCard(id: string): string {
  const product = getProduct(id)
  return product ? \`\${addToCart(id)} — price \${product.price}\` : 'missing'
}
`

export const spec: LabSpec = {
  id: '14.4',
  title: 'Задание 14.4 — FSD-срез без циклов: направление слоёв (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/product/model/store.ts', content: productStore, role: 'readonly' },
    { path: 'src/entities/product/index.ts', content: productIndexStart, role: 'editable' },
    {
      path: 'src/features/add-to-cart/model/store.ts',
      content: addToCartStore,
      role: 'readonly',
    },
    { path: 'src/features/add-to-cart/index.ts', content: addToCartIndex, role: 'readonly' },
    { path: 'src/widgets/product-card/index.ts', content: productCardIndex, role: 'readonly' },
  ],
  solution: [
    { path: 'src/entities/product/model/store.ts', content: productStore, role: 'readonly' },
    { path: 'src/entities/product/index.ts', content: productIndexSolution, role: 'editable' },
    {
      path: 'src/features/add-to-cart/model/store.ts',
      content: addToCartStore,
      role: 'readonly',
    },
    { path: 'src/features/add-to-cart/index.ts', content: addToCartIndex, role: 'readonly' },
    { path: 'src/widgets/product-card/index.ts', content: productCardIndex, role: 'readonly' },
  ],
  checks: [noRuntimeCycles(), importsRespectLayers()],
}
