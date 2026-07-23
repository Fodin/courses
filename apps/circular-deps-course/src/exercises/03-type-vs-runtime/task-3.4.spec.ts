import {
  fileContains,
  fileExists,
  importIsTypeOnly,
  noRuntimeCycles,
  type LabSpec,
} from 'src/engine'

/**
 * Задание 3.4 (простое) — Вынести общий тип в отдельный файл.
 *
 * `order.ts` экспортирует и тип (`Order`), и значение (`formatOrder`), а сам
 * реально зависит от значения `userName` из `user.ts`. `user.ts`, в свою
 * очередь, импортирует `Order` из `order.ts` обычным импортом, хотя использует
 * его только как тип, — это и замыкает цикл. Вместо точечного `import type`
 * (как в 3.1) нужно применить приём «общий тип — в отдельный файл»: перенести
 * `Order` в новый `types.ts` и подключить его оттуда в обоих модулях.
 */

const orderStart = `import { userName } from './user'

export interface Order {
  id: string
  owner: string
}

export function formatOrder(order: Order): string {
  return \`\${order.id} for \${userName}\`
}
`

const orderSolution = `import { userName } from './user'
import type { Order } from './types'

export function formatOrder(order: Order): string {
  return \`\${order.id} for \${userName}\`
}
`

const userStart = `import { Order } from './order'
// TODO: Order используется здесь только как тип. Импорт из './order' тянет весь
// модуль (а он сам импортирует './user') — перенесите тип Order в './types'
// и импортируйте его оттуда как import type

export const userName = 'Ann'

export function describeOrder(order: Order): string {
  return \`\${userName} owns \${order.id}\`
}
`

const userSolution = `import type { Order } from './types'

export const userName = 'Ann'

export function describeOrder(order: Order): string {
  return \`\${userName} owns \${order.id}\`
}
`

const typesStart = `// TODO: перенесите сюда тип Order из order.ts и импортируйте его
// в order.ts и user.ts через \`import type { Order } from './types'\`
`

const typesSolution = `export interface Order {
  id: string
  owner: string
}
`

export const spec: LabSpec = {
  id: '3.4',
  title: 'Задание 3.4 — Вынести общий тип в отдельный файл (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/order.ts', content: orderStart, role: 'editable' },
    { path: 'src/user.ts', content: userStart, role: 'editable' },
    { path: 'src/types.ts', content: typesStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/order.ts', content: orderSolution, role: 'editable' },
    { path: 'src/user.ts', content: userSolution, role: 'editable' },
    { path: 'src/types.ts', content: typesSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileExists('src/types.ts'),
    fileContains('src/types.ts', /export interface Order/, '`types.ts` содержит тип `Order`'),
    importIsTypeOnly(
      'src/user.ts',
      /\.\/types/,
      '`user.ts` импортирует `Order` из `types.ts` как тип'
    ),
    importIsTypeOnly(
      'src/order.ts',
      /\.\/types/,
      '`order.ts` импортирует `Order` из `types.ts` как тип'
    ),
    fileContains(
      'src/order.ts',
      /import\s*\{\s*userName\s*\}\s*from\s*'\.\/user'/,
      '`order.ts` по-прежнему импортирует `userName` как значение — реальная зависимость сохранена'
    ),
  ],
}
