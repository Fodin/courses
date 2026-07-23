import { noRuntimeCycles, fileExists, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 7.7 (простое) — Вынос общего в третий модуль.
 *
 * Дано: user.ts и order.ts взаимно импортируют типы друг друга — цикл на
 * двух файлах. Задача: вынести оба типа в новый файл types.ts, от которого
 * оба модуля зависят «вниз», не ссылаясь друг на друга напрямую.
 */

const userStart = `import { Order } from './order'

export interface User {
  id: string
  orders: Order[]
}
`

const orderStart = `import { User } from './user'

export interface Order {
  id: string
  owner: User
}
`

const typesStart = `// TODO: вынесите сюда общие типы User и Order,
// которые сейчас циклически ссылаются друг на друга в user.ts и order.ts.
`

const typesSolution = `export interface User {
  id: string
  orders: Order[]
}

export interface Order {
  id: string
  owner: User
}
`

const userSolution = `import type { User } from './types'

export function createEmptyUser(id: string): User {
  return { id, orders: [] }
}
`

const orderSolution = `import type { Order, User } from './types'

export function createOrder(id: string, owner: User): Order {
  return { id, owner }
}
`

export const spec: LabSpec = {
  id: '7.7',
  title: 'Задание 7.7 — Вынос общего в третий модуль (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/user.ts', content: userStart, role: 'editable' },
    { path: 'src/order.ts', content: orderStart, role: 'editable' },
    { path: 'src/types.ts', content: typesStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/user.ts', content: userSolution, role: 'editable' },
    { path: 'src/order.ts', content: orderSolution, role: 'editable' },
    { path: 'src/types.ts', content: typesSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileExists('src/types.ts'),
    fileContains('src/types.ts', /interface\s+User/, '`types.ts` содержит `interface User`'),
    fileContains('src/types.ts', /interface\s+Order/, '`types.ts` содержит `interface Order`'),
  ],
}
