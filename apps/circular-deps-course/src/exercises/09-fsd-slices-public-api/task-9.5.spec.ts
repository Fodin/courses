import { fileContains, noDeepImport, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 9.5 (среднее) — Несколько глубоких импортов, один из них замыкает цикл.
 *
 * Три глубоких импорта в обход public API:
 * 1) `entities/user/model/user.ts` тянет `Order` напрямую из `entities/order/model/user.ts`
 *    и хранит его целиком как `lastOrder` — безобидно на вид;
 * 2) `entities/order/model/order.ts` тянет `User` напрямую из `entities/user/model/user.ts`
 *    и хранит его целиком как `owner` — а вот это уже замыкает цикл `user ⇄ order`;
 * 3) `features/dashboard/model/stats.ts` тянет тип `Order` напрямую из
 *    `entities/order/model/order.ts` — просто нарушение public API, в цикле не участвует.
 *
 * Разрыв: `user` и `order` должны знать друг о друге по идентификатору, а не
 * вложенным объектом — тогда деглубить импорты (1) и (2) незачем, они пропадают
 * вместе с полями. Импорт (3) чинится переключением на public API `entities/order`.
 */

const userStart = `import { Order } from '@/entities/order/model/order' // TODO: user не обязан хранить целый Order

export interface User {
  id: string
  name: string
  lastOrder: Order
}
`

const userSolution = `export interface User {
  id: string
  name: string
  lastOrderId: string
}
`

const userIndex = `export { User } from './model/user'
`

const orderStart = `import { User } from '@/entities/user/model/user' // TODO: order не обязан хранить целого User — и это замыкает цикл

export interface Order {
  id: string
  owner: User
}
`

const orderSolution = `export interface Order {
  id: string
  ownerId: string
}
`

const orderIndex = `export { Order } from './model/order'
`

const dashboardStart = `import type { Order } from '@/entities/order/model/order' // TODO: обход public API

export function describeOrder(order: Order): string {
  return 'Order #' + order.id
}
`

const dashboardSolution = `import type { Order } from '@/entities/order'

export function describeOrder(order: Order): string {
  return 'Order #' + order.id
}
`

const dashboardIndex = `export { describeOrder } from './model/stats'
`

export const spec: LabSpec = {
  id: '9.5',
  title: 'Задание 9.5 — Несколько глубоких импортов, один замыкает цикл (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/user/model/user.ts', content: userStart, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' },
    { path: 'src/entities/order/model/order.ts', content: orderStart, role: 'editable' },
    { path: 'src/entities/order/index.ts', content: orderIndex, role: 'readonly' },
    { path: 'src/features/dashboard/model/stats.ts', content: dashboardStart, role: 'editable' },
    { path: 'src/features/dashboard/index.ts', content: dashboardIndex, role: 'readonly' },
  ],
  solution: [
    { path: 'src/entities/user/model/user.ts', content: userSolution, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' },
    { path: 'src/entities/order/model/order.ts', content: orderSolution, role: 'editable' },
    { path: 'src/entities/order/index.ts', content: orderIndex, role: 'readonly' },
    { path: 'src/features/dashboard/model/stats.ts', content: dashboardSolution, role: 'editable' },
    { path: 'src/features/dashboard/index.ts', content: dashboardIndex, role: 'readonly' },
  ],
  checks: [
    noDeepImport(),
    noRuntimeCycles(),
    fileContains(
      'src/entities/user/model/user.ts',
      /lastOrderId\s*:/,
      'User хранит lastOrderId, а не вложенный Order'
    ),
    fileContains(
      'src/entities/order/model/order.ts',
      /ownerId\s*:/,
      'Order хранит ownerId, а не вложенный User'
    ),
  ],
}
