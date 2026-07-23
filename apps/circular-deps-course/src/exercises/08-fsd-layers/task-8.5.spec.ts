import { importsRespectLayers, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 8.5 (среднее) — Кольцо из трёх слайсов одного слоя.
 *
 * `entities/user → entities/order → entities/payment → entities/user` —
 * три соседних слайса замкнуты в кольцо cross-import'ов. Каждое ребро — само
 * по себе нарушение изоляции слайсов, а вместе они образуют трёхузловой цикл.
 *
 * Задача: убрать все три cross-import'а, передав нужные значения параметрами
 * вместо прямых импортов между слайсами.
 */

const userModelStart = `import { getLastOrderId } from '../../order/model/order'

export interface User {
  id: string
  name: string
}

export function getUserName(userId: string): string {
  return \`user-\${userId}\`
}

export function describeUser(user: User): string {
  return \`\${user.name} — \${getLastOrderId(user.id)}\`
}
`

const userModelSolution = `export interface User {
  id: string
  name: string
}

export function getUserName(userId: string): string {
  return \`user-\${userId}\`
}

export function describeUser(user: User, lastOrderId: string): string {
  return \`\${user.name} — \${lastOrderId}\`
}
`

const orderModelStart = `import { getPaymentStatus } from '../../payment/model/payment'

export function getLastOrderId(userId: string): string {
  return \`order-\${userId} (\${getPaymentStatus(userId)})\`
}
`

const orderModelSolution = `export function getLastOrderId(userId: string, paymentStatus: string): string {
  return \`order-\${userId} (\${paymentStatus})\`
}
`

const paymentModelStart = `import { getUserName } from '../../user/model/user'

export function getPaymentStatus(userId: string): string {
  return \`paid by \${getUserName(userId)}\`
}
`

const paymentModelSolution = `export function getPaymentStatus(userId: string, userName: string): string {
  return \`paid by \${userName}\`
}
`

export const spec: LabSpec = {
  id: '8.5',
  title: 'Задание 8.5 — Кольцо из трёх слайсов одного слоя (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/user/model/user.ts', content: userModelStart, role: 'editable' },
    { path: 'src/entities/order/model/order.ts', content: orderModelStart, role: 'editable' },
    { path: 'src/entities/payment/model/payment.ts', content: paymentModelStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/entities/user/model/user.ts', content: userModelSolution, role: 'editable' },
    { path: 'src/entities/order/model/order.ts', content: orderModelSolution, role: 'editable' },
    {
      path: 'src/entities/payment/model/payment.ts',
      content: paymentModelSolution,
      role: 'editable',
    },
  ],
  checks: [noRuntimeCycles(), importsRespectLayers()],
}
