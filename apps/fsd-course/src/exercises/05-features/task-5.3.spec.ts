import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 5.3 (сложное) — Фича собирает несколько сущностей и shared.
 *
 * `features/checkout` — сценарий оформления заказа: берёт товары из
 * `entities/cart`, создаёт `Order` (тип из `entities/order`) и форматирует сумму
 * через `shared/lib`. Сейчас фича лезет вглубь всех трёх слайсов сразу, а её
 * собственный public API пуст. Задача: развести все импорты через public API
 * слайсов и собрать public API самой фичи.
 */

const cartStore = `export const cartStore = {
  items: [{ productId: 'p1', price: 500 }, { productId: 'p2', price: 1500 }],
  total(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0)
  },
}
`
const cartIndex = `export { cartStore } from './model/store'
`

const orderTypes = `export interface Order {
  id: string
  total: number
}
`
const orderIndex = `export type { Order } from './model/types'
`

const formatPrice = `export function formatPrice(value: number): string {
  return \`\${value} ₽\`
}
`
const libIndex = `export { formatPrice } from './formatPrice'
`

// НАРУШЕНИЕ: фича лезет вглубь всех трёх слайсов мимо их public API.
const checkoutStart = `import { cartStore } from '@/entities/cart/model/store'
import type { Order } from '@/entities/order/model/types'
import { formatPrice } from '@/shared/lib/formatPrice'

export function checkout(): { order: Order; label: string } {
  const total = cartStore.total()
  const order: Order = { id: 'o1', total }
  return { order, label: formatPrice(total) }
}
`

const checkoutSolution = `import { cartStore } from '@/entities/cart'
import type { Order } from '@/entities/order'
import { formatPrice } from '@/shared/lib'

export function checkout(): { order: Order; label: string } {
  const total = cartStore.total()
  const order: Order = { id: 'o1', total }
  return { order, label: formatPrice(total) }
}
`

// НАРУШЕНИЕ: у фичи нет public API.
const featureIndexStart = `// Public API фичи features/checkout.
// TODO: реэкспортируйте checkout из ./model/checkout.
`
const featureIndexSolution = `export { checkout } from './model/checkout'
`

const roFiles = [
  { path: 'src/entities/cart/model/store.ts', content: cartStore, role: 'readonly' as const },
  { path: 'src/entities/cart/index.ts', content: cartIndex, role: 'readonly' as const },
  { path: 'src/entities/order/model/types.ts', content: orderTypes, role: 'readonly' as const },
  { path: 'src/entities/order/index.ts', content: orderIndex, role: 'readonly' as const },
  { path: 'src/shared/lib/formatPrice.ts', content: formatPrice, role: 'readonly' as const },
  { path: 'src/shared/lib/index.ts', content: libIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '5.3',
  title: 'Задание 5.3 — Фича собирает несколько сущностей (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/features/checkout/model/checkout.ts', content: checkoutStart, role: 'editable' },
    { path: 'src/features/checkout/index.ts', content: featureIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/features/checkout/model/checkout.ts',
      content: checkoutSolution,
      role: 'editable',
    },
    { path: 'src/features/checkout/index.ts', content: featureIndexSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/features/checkout/index.ts', 'checkout', './model/checkout'),
    fileContains(
      'src/features/checkout/model/checkout.ts',
      /from\s*'@\/entities\/cart'/,
      'checkout берёт cartStore через public API entities/cart'
    ),
    fileContains(
      'src/features/checkout/model/checkout.ts',
      /from\s*'@\/entities\/order'/,
      'checkout берёт тип Order через public API entities/order'
    ),
    fileContains(
      'src/features/checkout/model/checkout.ts',
      /from\s*'@\/shared\/lib'/,
      'checkout берёт formatPrice через public API shared/lib'
    ),
  ],
}
