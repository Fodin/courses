import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 5.6 (сложное) — Распутываем фичу с двойным нарушением.
 *
 * `features/order-review` нарушает сразу оба правила уровня:
 * 1. импортирует вверх — берёт `PANEL_WIDTH` из `widgets/cart-panel`, хотя
 *    вопрос разметки — забота виджета, а не фичи;
 * 2. тянет соседнюю фичу — берёт скидку из `features/loyalty-points`, хотя
 *    такая же общая формула уже вынесена в `shared/lib`.
 *
 * Задача: убрать оба нарушения — фича больше не занимается разметкой и
 * пользуется общей формулой скидки из `shared/lib`, а не соседней фичей.
 */

const cartStore = `export const cartStore = {
  items: [{ productId: 'p1', price: 1000 }],
  total(): number {
    return this.items.reduce((sum, item) => sum + item.price, 0)
  },
}
`
const cartIndex = `export { cartStore } from './model/store'
`

const cartPanelLayout = `export const PANEL_WIDTH = 320
`
const cartPanelIndex = `export { PANEL_WIDTH } from './lib/layout'
`

const loyaltyDiscount = `export function discount(total: number): number {
  return total * 0.9
}
`
const loyaltyIndex = `export { discount } from './model/discount'
`

const sharedApplyPromo = `export function applyPromo(total: number): number {
  return total * 0.9
}
`
const sharedFormatPrice = `export function formatPrice(value: number): string {
  return \`\${value} ₽\`
}
`
const sharedLibIndex = `export { applyPromo } from './applyPromo'
export { formatPrice } from './formatPrice'
`

// ДВА НАРУШЕНИЯ: импорт вверх (widgets/cart-panel) + cross-import соседней
// фичи (features/loyalty-points).
const summaryStart = `import { PANEL_WIDTH } from '@/widgets/cart-panel'
import { discount } from '@/features/loyalty-points'
import { cartStore } from '@/entities/cart'
import { formatPrice } from '@/shared/lib'

// TODO: уберите импорт из widgets/cart-panel (разметка — забота виджета) и
// замените discount из соседней фичи loyalty-points на applyPromo из shared/lib.
export function getOrderSummary(): { total: string; width: number } {
  const total = discount(cartStore.total())
  return { total: formatPrice(total), width: PANEL_WIDTH }
}
`

const summarySolution = `import { applyPromo, formatPrice } from '@/shared/lib'
import { cartStore } from '@/entities/cart'

export function getOrderSummary(): { total: string } {
  const total = applyPromo(cartStore.total())
  return { total: formatPrice(total) }
}
`

const featureIndexStart = `// Public API фичи features/order-review.
// TODO: реэкспортируйте getOrderSummary из ./model/summary.
`
const featureIndexSolution = `export { getOrderSummary } from './model/summary'
`

const roFiles = [
  { path: 'src/entities/cart/model/store.ts', content: cartStore, role: 'readonly' as const },
  { path: 'src/entities/cart/index.ts', content: cartIndex, role: 'readonly' as const },
  {
    path: 'src/widgets/cart-panel/lib/layout.ts',
    content: cartPanelLayout,
    role: 'readonly' as const,
  },
  { path: 'src/widgets/cart-panel/index.ts', content: cartPanelIndex, role: 'readonly' as const },
  {
    path: 'src/features/loyalty-points/model/discount.ts',
    content: loyaltyDiscount,
    role: 'readonly' as const,
  },
  {
    path: 'src/features/loyalty-points/index.ts',
    content: loyaltyIndex,
    role: 'readonly' as const,
  },
  { path: 'src/shared/lib/applyPromo.ts', content: sharedApplyPromo, role: 'readonly' as const },
  { path: 'src/shared/lib/formatPrice.ts', content: sharedFormatPrice, role: 'readonly' as const },
  { path: 'src/shared/lib/index.ts', content: sharedLibIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '5.6',
  title: 'Задание 5.6 — Распутываем фичу с двойным нарушением (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    {
      path: 'src/features/order-review/model/summary.ts',
      content: summaryStart,
      role: 'editable',
    },
    { path: 'src/features/order-review/index.ts', content: featureIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/features/order-review/model/summary.ts',
      content: summarySolution,
      role: 'editable',
    },
    {
      path: 'src/features/order-review/index.ts',
      content: featureIndexSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi(
      'src/features/order-review/index.ts',
      'getOrderSummary',
      './model/summary'
    ),
    fileContains(
      'src/features/order-review/model/summary.ts',
      /from\s*'@\/shared\/lib'/,
      'Скидка и форматирование берутся из общего shared/lib'
    ),
    fileContains(
      'src/features/order-review/model/summary.ts',
      /applyPromo\(/,
      'Используется общая формула applyPromo, а не discount соседней фичи'
    ),
  ],
}
