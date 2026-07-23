import { importsRespectLayers, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 10.4 (простое) — Несколько нарушений сразу: цикл + импорт вверх.
 *
 * `entities/product` импортирует `addToCart` из `features/add-to-cart` — это
 * одновременно импорт вверх по слоям (нарушение 1 из README) и рантайм-цикл,
 * потому что `features/add-to-cart` легально импортирует `Product` обратно.
 * Чинится ОДНОЙ правкой: убрать импорт фичи из entities и передавать колбэк
 * снаружи (dependency injection), как показано в теории.
 */

const addToCartStart = `import { Product } from '@/entities/product'

export function addToCart(product: Product): void {
  console.log('added to cart:', product.id)
}
`

const productStart = `import { addToCart } from '@/features/add-to-cart'

export interface Product {
  id: string
  name: string
}

// TODO: entities не должен импортировать features — передай addAction снаружи
export function getProductWithCartAction(id: string, name: string) {
  const product: Product = { id, name }
  return { product, addAction: () => addToCart(product) }
}
`

const productSolution = `export interface Product {
  id: string
  name: string
}

export function getProductWithCartAction(
  id: string,
  name: string,
  addAction: (product: Product) => void
) {
  const product: Product = { id, name }
  return { product, addAction: () => addAction(product) }
}
`

const roFiles = [
  {
    path: 'src/features/add-to-cart/index.ts',
    content: addToCartStart,
    role: 'readonly' as const,
  },
]

export const spec: LabSpec = {
  id: '10.4',
  title: 'Задание 10.4 — Несколько нарушений сразу: цикл + импорт вверх (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/product/index.ts', content: productStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/product/index.ts', content: productSolution, role: 'editable' },
  ],
  checks: [noRuntimeCycles(), importsRespectLayers()],
}
