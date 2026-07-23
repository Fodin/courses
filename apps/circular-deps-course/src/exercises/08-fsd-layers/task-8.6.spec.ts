import { importsRespectLayers, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 8.6 (сложное) — Узел из нескольких cross-import'ов между слайсами.
 *
 * Четыре слайса одного слоя — `user`, `order`, `product`, `review` — опутаны
 * семью cross-import'ами и образуют сразу три двухузловых цикла:
 * `user ↔ order`, `user ↔ review`, `product ↔ review`.
 *
 * Задача: распутать узел — убрать ВСЕ cross-import'ы между слайсами
 * (`user`, `order`, `product`, `review`), передавая нужные значения параметрами.
 */

const userModelStart = `import { getLastOrder } from '../../order/model/order'
import { getLatestReview } from '../../review/model/review'

export interface User {
  id: string
  name: string
}

export function getUserDisplayName(userId: string): string {
  return \`User#\${userId}\`
}

export function describeUser(user: User): string {
  return \`\${user.name}: \${getLastOrder(user.id)}, \${getLatestReview(user.id)}\`
}
`

const userModelSolution = `export interface User {
  id: string
  name: string
}

export function getUserDisplayName(userId: string): string {
  return \`User#\${userId}\`
}

export function describeUser(user: User, lastOrder: string, latestReview: string): string {
  return \`\${user.name}: \${lastOrder}, \${latestReview}\`
}
`

const orderModelStart = `import { getProductTitle } from '../../product/model/product'
import { getUserDisplayName } from '../../user/model/user'

export function getLastOrder(userId: string): string {
  return \`\${getUserDisplayName(userId)} ordered \${getProductTitle('sku-1')}\`
}
`

const orderModelSolution = `export function getLastOrder(userDisplayName: string, productTitle: string): string {
  return \`\${userDisplayName} ordered \${productTitle}\`
}
`

const productModelStart = `import { getAverageRating } from '../../review/model/review'

export function getProductTitle(sku: string): string {
  return \`Product \${sku} (\${getAverageRating(sku)})\`
}
`

const productModelSolution = `export function getProductTitle(sku: string, averageRating: string): string {
  return \`Product \${sku} (\${averageRating})\`
}
`

const reviewModelStart = `import { getProductTitle } from '../../product/model/product'
import { getUserDisplayName } from '../../user/model/user'

export function getAverageRating(sku: string): string {
  return \`\${sku}: 4.5\`
}

export function getLatestReview(userId: string): string {
  return \`\${getUserDisplayName(userId)} liked \${getProductTitle('sku-1')}\`
}
`

const reviewModelSolution = `export function getAverageRating(sku: string): string {
  return \`\${sku}: 4.5\`
}

export function getLatestReview(userDisplayName: string, productTitle: string): string {
  return \`\${userDisplayName} liked \${productTitle}\`
}
`

export const spec: LabSpec = {
  id: '8.6',
  title: 'Задание 8.6 — Узел из нескольких cross-import’ов между слайсами (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/user/model/user.ts', content: userModelStart, role: 'editable' },
    { path: 'src/entities/order/model/order.ts', content: orderModelStart, role: 'editable' },
    { path: 'src/entities/product/model/product.ts', content: productModelStart, role: 'editable' },
    { path: 'src/entities/review/model/review.ts', content: reviewModelStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/entities/user/model/user.ts', content: userModelSolution, role: 'editable' },
    { path: 'src/entities/order/model/order.ts', content: orderModelSolution, role: 'editable' },
    {
      path: 'src/entities/product/model/product.ts',
      content: productModelSolution,
      role: 'editable',
    },
    { path: 'src/entities/review/model/review.ts', content: reviewModelSolution, role: 'editable' },
  ],
  checks: [noRuntimeCycles(), importsRespectLayers()],
}
