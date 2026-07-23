import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 12.6 (сложное) — Код-ревью: несколько разных нарушений сразу.
 *
 * В `features/order-review` собрались сразу четыре нарушения границ FSD:
 * 1) глубокий импорт в `entities/order/model` мимо public API;
 * 2) импорт вверх из `pages/orders`;
 * 3) cross-import соседнего слайса `features/customer-badge`;
 * 4) доменная сущность `Discount` лежит в `shared/lib` вместо `entities/discount`.
 * Задача: починить все четыре, ничего не сломав.
 */

const orderTypes = `export interface Order {
  id: string
  total: number
}
`
const orderIndex = `export type { Order } from './model/types'
`

const customerTypes = `export interface Customer {
  id: string
  name: string
}
`
const customerIndex = `export type { Customer } from './model/types'
`

const formatDateLib = `export function formatDate(date: string): string {
  return date
}
`

const customerBadgeIndex = `export const CustomerBadge = 'badge'
`

// НАРУШЕНИЕ 4: доменная сущность Discount лежит в shared.
const sharedDiscountStart = `export interface Discount {
  id: string
  percent: number
}

export function applyDiscount(total: number, discount: Discount): number {
  return total - (total * discount.percent) / 100
}
`
const sharedDiscountSolution = `// Discount — доменная сущность, перенесена в entities/discount.
export {}
`

const discountModelStart = `// TODO: перенесите сюда Discount и applyDiscount из shared/lib/discount.ts
export {}
`
const discountModelSolution = `export interface Discount {
  id: string
  percent: number
}

export function applyDiscount(total: number, discount: Discount): number {
  return total - (total * discount.percent) / 100
}
`

const discountIndexStart = `// TODO: реэкспортируйте Discount и applyDiscount из ./model/discount
export {}
`
const discountIndexSolution = `export type { Discount } from './model/discount'
export { applyDiscount } from './model/discount'
`

// НАРУШЕНИЯ 1-3 сразу в одном файле.
const reviewStart = `import type { Order } from '@/entities/order/model/types'
import type { Customer } from '@/entities/customer'
import { formatDate } from '@/pages/orders/lib/format-date'
import { CustomerBadge } from '@/features/customer-badge'

export interface OrderReview {
  order: Order
  customer: Customer
  createdAt: string
}

export function describe(review: OrderReview): string {
  return \`\${formatDate(review.createdAt)} \${review.customer.name} \${CustomerBadge}\`
}
`

const reviewSolution = `import type { Order } from '@/entities/order'
import type { Customer } from '@/entities/customer'
import type { Discount } from '@/entities/discount'

export interface OrderReview {
  order: Order
  customer: Customer
  discount: Discount
  createdAt: string
}

export function describe(review: OrderReview): string {
  return \`\${review.createdAt} \${review.customer.name}\`
}
`

const roFiles = [
  { path: 'src/entities/order/model/types.ts', content: orderTypes, role: 'readonly' as const },
  { path: 'src/entities/order/index.ts', content: orderIndex, role: 'readonly' as const },
  {
    path: 'src/entities/customer/model/types.ts',
    content: customerTypes,
    role: 'readonly' as const,
  },
  { path: 'src/entities/customer/index.ts', content: customerIndex, role: 'readonly' as const },
  {
    path: 'src/pages/orders/lib/format-date.ts',
    content: formatDateLib,
    role: 'readonly' as const,
  },
  {
    path: 'src/features/customer-badge/index.ts',
    content: customerBadgeIndex,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '12.6',
  title: 'Задание 12.6 — Код-ревью: несколько нарушений сразу (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/shared/lib/discount.ts', content: sharedDiscountStart, role: 'editable' },
    {
      path: 'src/entities/discount/model/discount.ts',
      content: discountModelStart,
      role: 'editable',
    },
    { path: 'src/entities/discount/index.ts', content: discountIndexStart, role: 'editable' },
    { path: 'src/features/order-review/model/review.ts', content: reviewStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/shared/lib/discount.ts', content: sharedDiscountSolution, role: 'editable' },
    {
      path: 'src/entities/discount/model/discount.ts',
      content: discountModelSolution,
      role: 'editable',
    },
    { path: 'src/entities/discount/index.ts', content: discountIndexSolution, role: 'editable' },
    {
      path: 'src/features/order-review/model/review.ts',
      content: reviewSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/entities/discount/index.ts', 'Discount', './model/discount'),
    exportsFromPublicApi('src/entities/discount/index.ts', 'applyDiscount', './model/discount'),
    fileContains(
      'src/shared/lib/discount.ts',
      /^(?:(?!interface Discount)[\s\S])*$/,
      'В shared/lib/discount.ts больше нет доменного интерфейса Discount'
    ),
    fileContains(
      'src/features/order-review/model/review.ts',
      /from\s+'@\/entities\/discount'/,
      'OrderReview импортирует Discount из entities/discount'
    ),
    fileContains(
      'src/features/order-review/model/review.ts',
      /^(?:(?!pages\/orders)[\s\S])*$/,
      'В review.ts не осталось импорта из pages/orders'
    ),
    fileContains(
      'src/features/order-review/model/review.ts',
      /^(?:(?!features\/customer-badge)[\s\S])*$/,
      'В review.ts не осталось cross-import features/customer-badge'
    ),
    fileContains(
      'src/features/order-review/model/review.ts',
      /^(?:(?!shared\/lib\/discount)[\s\S])*$/,
      'В review.ts не осталось импорта из shared/lib/discount'
    ),
  ],
}
