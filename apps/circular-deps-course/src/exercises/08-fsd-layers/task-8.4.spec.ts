import { importsRespectLayers, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 8.4 (простое) — Cross-import слайсов одного слоя рождает цикл.
 *
 * `entities/user` и `entities/order` — соседние слайсы ОДНОГО слоя — импортируют
 * друг друга напрямую: `user` тянет `getLastOrderId` из `order`, а `order`
 * тянет тип `User` из `user`. Слайсы одного слоя не должны знать друг о друге
 * (кроме `shared`) — и вдобавок эта пара образует рантайм-цикл.
 *
 * Задача: убрать оба cross-import между `user` и `order`, передав вместо
 * целого объекта примитив (id/строку) параметром.
 */

const userModelStart = `import { getLastOrderId } from '../../order/model/order'

export interface User {
  id: string
  name: string
}

export function describeUser(user: User): string {
  return \`\${user.name} (last order: \${getLastOrderId(user.id)})\`
}
`

const userModelSolution = `export interface User {
  id: string
  name: string
}

export function describeUser(user: User, lastOrderId: string): string {
  return \`\${user.name} (last order: \${lastOrderId})\`
}
`

const orderModelStart = `import { User } from '../../user/model/user'

export function getLastOrderId(userId: string): string {
  return \`order-\${userId}-42\`
}

export function attachOwner(order: { id: string }, owner: User): { id: string; owner: User } {
  return { ...order, owner }
}
`

const orderModelSolution = `export function getLastOrderId(userId: string): string {
  return \`order-\${userId}-42\`
}

export function attachOwner(
  order: { id: string },
  ownerId: string
): { id: string; ownerId: string } {
  return { ...order, ownerId }
}
`

export const spec: LabSpec = {
  id: '8.4',
  title: 'Задание 8.4 — Cross-import слайсов одного слоя рождает цикл (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/user/model/user.ts', content: userModelStart, role: 'editable' },
    { path: 'src/entities/order/model/order.ts', content: orderModelStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/entities/user/model/user.ts', content: userModelSolution, role: 'editable' },
    { path: 'src/entities/order/model/order.ts', content: orderModelSolution, role: 'editable' },
  ],
  checks: [noRuntimeCycles(), importsRespectLayers()],
}
