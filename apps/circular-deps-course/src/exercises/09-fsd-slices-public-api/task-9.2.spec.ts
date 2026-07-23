import { fileContains, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 9.2 (среднее) — Два слайса тянут друг друга через public API.
 *
 * `entities/order` встраивает в `Order` целый объект `User` (через public API
 * `entities/user`), а `entities/user` в ответ умеет достать последний `Order`
 * (тоже через public API `entities/order`). Оба перехода легальны по отдельности
 * (public API соблюдён!), но вместе они образуют цикл между слайсами одного слоя.
 * Разрыв: `entities/order` не обязан хранить владельца целиком — достаточно `ownerId`.
 */

const userModel = `import { Order } from '@/entities/order'

export interface User {
  id: string
  name: string
}

export function getUserLastOrder(id: string, orders: Order[]): Order | undefined {
  return orders.find(order => order.ownerId === id)
}
`

// Барель написан двустрочно (import + export), а не однострочным
// \`export { x } from './y'\` — так реэкспорт реально создаёт ребро в графе
// импортов, и цикл через барели по-настоящему детектируется.
const userIndex = `import { User, getUserLastOrder } from './model/user'

export { User, getUserLastOrder }
`

const orderModelStart = `import { User } from '@/entities/user' // TODO: order не обязан хранить целого User

export interface Order {
  id: string
  owner: User
}

export function findOrder(id: string, orders: Order[]): Order | undefined {
  return orders.find(order => order.id === id)
}
`

const orderModelSolution = `export interface Order {
  id: string
  ownerId: string
}

export function findOrder(id: string, orders: Order[]): Order | undefined {
  return orders.find(order => order.id === id)
}
`

const orderIndex = `import { Order, findOrder } from './model/order'

export { Order, findOrder }
`

export const spec: LabSpec = {
  id: '9.2',
  title: 'Задание 9.2 — Слайсы тянут друг друга через public API (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/user/model/user.ts', content: userModel, role: 'readonly' },
    { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' },
    { path: 'src/entities/order/model/order.ts', content: orderModelStart, role: 'editable' },
    { path: 'src/entities/order/index.ts', content: orderIndex, role: 'readonly' },
  ],
  solution: [
    { path: 'src/entities/user/model/user.ts', content: userModel, role: 'readonly' },
    { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' },
    { path: 'src/entities/order/model/order.ts', content: orderModelSolution, role: 'editable' },
    { path: 'src/entities/order/index.ts', content: orderIndex, role: 'readonly' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/entities/order/model/order.ts',
      /ownerId\s*:/,
      'Order хранит только ownerId, а не вложенный объект User'
    ),
  ],
}
