import { noDeepImport, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 10.5 (среднее) — Несколько нарушений сразу: цикл + глубокий импорт.
 *
 * `features/checkout` импортирует `validateCoupon` напрямую из
 * `entities/order/lib/coupon-validator.ts`, минуя `entities/order/index.ts`
 * (обход public API). А `coupon-validator.ts` в ответ импортирует
 * `notifyCouponApplied` из `features/checkout` — это замыкает рантайм-цикл.
 * Нужно: (1) добавить `validateCoupon` в public API `entities/order`, завести
 * `features/checkout` импортировать оттуда; (2) убрать из `coupon-validator.ts`
 * лишнюю зависимость от features — уведомление должно быть заботой самого
 * checkout, а не валидатора купона.
 */

const orderTypesStart = `export interface Order {
  id: string
  couponCode?: string
}
`

const orderIndexStart = `export type { Order } from './model/types'

// TODO: validateCoupon используется снаружи, но не экспортируется — добавь его в public API
`

const orderIndexSolution = `export type { Order } from './model/types'
export { validateCoupon } from './lib/coupon-validator'
`

const couponValidatorStart = `import { notifyCouponApplied } from '@/features/checkout'

// TODO: валидатору не нужно знать про features — убери лишний импорт
export function validateCoupon(code: string): boolean {
  const valid = code.startsWith('SALE')
  if (valid) notifyCouponApplied(code)
  return valid
}
`

const couponValidatorSolution = `export function validateCoupon(code: string): boolean {
  return code.startsWith('SALE')
}
`

const checkoutStart = `import { validateCoupon } from '@/entities/order/lib/coupon-validator'

export function notifyCouponApplied(code: string): void {
  console.log('coupon applied:', code)
}

// TODO: импортируй validateCoupon через public API entities/order, а не в обход
export function checkout(code: string): boolean {
  return validateCoupon(code)
}
`

const checkoutSolution = `import { validateCoupon } from '@/entities/order'

export function notifyCouponApplied(code: string): void {
  console.log('coupon applied:', code)
}

export function checkout(code: string): boolean {
  const valid = validateCoupon(code)
  if (valid) notifyCouponApplied(code)
  return valid
}
`

const roFiles = [
  {
    path: 'src/entities/order/model/types.ts',
    content: orderTypesStart,
    role: 'readonly' as const,
  },
]

export const spec: LabSpec = {
  id: '10.5',
  title: 'Задание 10.5 — Несколько нарушений сразу: цикл + глубокий импорт (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/order/index.ts', content: orderIndexStart, role: 'editable' },
    {
      path: 'src/entities/order/lib/coupon-validator.ts',
      content: couponValidatorStart,
      role: 'editable',
    },
    { path: 'src/features/checkout/index.ts', content: checkoutStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/order/index.ts', content: orderIndexSolution, role: 'editable' },
    {
      path: 'src/entities/order/lib/coupon-validator.ts',
      content: couponValidatorSolution,
      role: 'editable',
    },
    { path: 'src/features/checkout/index.ts', content: checkoutSolution, role: 'editable' },
  ],
  checks: [noRuntimeCycles(), noDeepImport()],
}
