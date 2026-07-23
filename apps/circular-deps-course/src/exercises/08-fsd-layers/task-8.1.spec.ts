import { importsRespectLayers, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 8.1 (простое) — Импорт вверх рождает цикл слоёв.
 *
 * `entities/user` напрямую вызывает функцию из `features/add-to-cart` (импорт
 * «вверх» по иерархии слоёв), а `features/add-to-cart` в ответ импортирует тип
 * `User` из `entities/user` (импорт «вниз», сам по себе разрешён). Вместе эти
 * два ребра замыкают двухузловой цикл `entities → features → entities`.
 *
 * Задача: убрать импорт «вверх» из `entities/user`, не трогая `features`.
 */

const cartModel = `import type { User } from '../../../entities/user/model/user'

export function getLastAddedProduct(): string {
  return 'sku-42'
}

export function addToCart(user: User, sku: string): void {
  // eslint-disable-next-line no-console
  console.log(\`\${user.name} added \${sku}\`)
}
`

const userModelStart = `import { getLastAddedProduct } from '../../../features/add-to-cart/model/cart'

export interface User {
  id: string
  name: string
}

export function greetUser(user: User): string {
  return \`Hi \${user.name}, last added: \${getLastAddedProduct()}\`
}
`

const userModelSolution = `export interface User {
  id: string
  name: string
}

export function greetUser(user: User, lastAdded: string): string {
  return \`Hi \${user.name}, last added: \${lastAdded}\`
}
`

export const spec: LabSpec = {
  id: '8.1',
  title: 'Задание 8.1 — Импорт вверх рождает цикл слоёв (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/features/add-to-cart/model/cart.ts', content: cartModel, role: 'readonly' },
    { path: 'src/entities/user/model/user.ts', content: userModelStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/features/add-to-cart/model/cart.ts', content: cartModel, role: 'readonly' },
    { path: 'src/entities/user/model/user.ts', content: userModelSolution, role: 'editable' },
  ],
  checks: [noRuntimeCycles(), importsRespectLayers()],
}
