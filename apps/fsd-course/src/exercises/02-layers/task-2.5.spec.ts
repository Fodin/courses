import { fileContains, importsRespectLayers, noDeepImport, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 2.5 (среднее) — Виджет тянет страницу.
 *
 * `widgets/order-summary` импортирует `getCurrentUser` из `pages/checkout` —
 * виджет опирается на вышестоящий слой. Задача: опустить композицию вниз —
 * виджет принимает `user` пропом, а страница сама передаёт его.
 */

const userTypes = `export interface User {
  id: string
  name: string
}
`
const userIndex = `export type { User } from './model/types'
`

const widgetIndex = `export { OrderSummary } from './ui/OrderSummary'
`
const pageIndex = `export { CheckoutPage } from './ui/CheckoutPage'
`

// НАРУШЕНИЕ: widgets импортирует функцию из pages (выше по стеку).
const orderSummaryStart = `import { getCurrentUser } from '@/pages/checkout'
import type { User } from '@/entities/user'

export function OrderSummary({ total }: { total: number }) {
  const user: User = getCurrentUser()
  return (
    <section className="order-summary">
      <p>Покупатель: {user.name}</p>
      <p>Итого: {total} ₽</p>
    </section>
  )
}
`

const orderSummarySolution = `import type { User } from '@/entities/user'

export function OrderSummary({ total, user }: { total: number; user: User }) {
  return (
    <section className="order-summary">
      <p>Покупатель: {user.name}</p>
      <p>Итого: {total} ₽</p>
    </section>
  )
}
`

const checkoutPageStart = `import { OrderSummary } from '@/widgets/order-summary'
import type { User } from '@/entities/user'

const demoUser: User = { id: '1', name: 'Ада' }

export function getCurrentUser(): User {
  return demoUser
}

export function CheckoutPage() {
  return (
    <main>
      <OrderSummary total={2500} />
    </main>
  )
}
`

const checkoutPageSolution = `import { OrderSummary } from '@/widgets/order-summary'
import type { User } from '@/entities/user'

const demoUser: User = { id: '1', name: 'Ада' }

export function CheckoutPage() {
  return (
    <main>
      <OrderSummary total={2500} user={demoUser} />
    </main>
  )
}
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/widgets/order-summary/index.ts', content: widgetIndex, role: 'readonly' as const },
  { path: 'src/pages/checkout/index.ts', content: pageIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '2.5',
  title: 'Задание 2.5 — Виджет тянет страницу (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    {
      path: 'src/widgets/order-summary/ui/OrderSummary.tsx',
      content: orderSummaryStart,
      role: 'editable',
    },
    { path: 'src/pages/checkout/ui/CheckoutPage.tsx', content: checkoutPageStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/widgets/order-summary/ui/OrderSummary.tsx',
      content: orderSummarySolution,
      role: 'editable',
    },
    {
      path: 'src/pages/checkout/ui/CheckoutPage.tsx',
      content: checkoutPageSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/widgets/order-summary/ui/OrderSummary.tsx',
      /user\s*:\s*User/,
      'OrderSummary принимает user пропом, а не тянет его со страницы'
    ),
    fileContains(
      'src/pages/checkout/ui/CheckoutPage.tsx',
      /<OrderSummary[^>]*user=\{demoUser\}/,
      'Страница передаёт пользователя в виджет пропом'
    ),
  ],
}
