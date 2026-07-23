import { noRuntimeCycles, fileExists, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 7.9 (сложное) — Вынос общего в третий модуль применяется дважды.
 *
 * Дано: два независимых двусторонних цикла — pricing.ts ↔ discount.ts и
 * shipping.ts ↔ address.ts, каждый из-за общей пары типов. Задача: вынести
 * каждую пару в свой собственный третий модуль (price-types.ts и
 * shipping-types.ts), приём применяется дважды.
 */

const pricingStart = `import { Discount } from './discount'

export interface PriceRule {
  id: string
  discount: Discount
}
`

const discountStart = `import { PriceRule } from './pricing'

export interface Discount {
  percent: number
  appliesTo: PriceRule
}
`

const priceTypesStart = `// TODO: вынесите сюда общие типы PriceRule и Discount,
// которые сейчас циклически ссылаются друг на друга в pricing.ts и discount.ts.
`

const priceTypesSolution = `export interface PriceRule {
  id: string
  discount: Discount
}

export interface Discount {
  percent: number
  appliesTo: PriceRule
}
`

const pricingSolution = `import type { PriceRule } from './price-types'

export function createPriceRule(id: string, discount: PriceRule['discount']): PriceRule {
  return { id, discount }
}
`

const discountSolution = `import type { Discount } from './price-types'

export function createDiscount(percent: number, appliesTo: Discount['appliesTo']): Discount {
  return { percent, appliesTo }
}
`

const shippingStart = `import { AddressZone } from './address'

export interface ShippingZone {
  id: string
  zone: AddressZone
}
`

const addressStart = `import { ShippingZone } from './shipping'

export interface AddressZone {
  code: string
  shipping: ShippingZone
}
`

const shippingTypesStart = `// TODO: вынесите сюда общие типы ShippingZone и AddressZone,
// которые сейчас циклически ссылаются друг на друга в shipping.ts и address.ts.
`

const shippingTypesSolution = `export interface ShippingZone {
  id: string
  zone: AddressZone
}

export interface AddressZone {
  code: string
  shipping: ShippingZone
}
`

const shippingSolution = `import type { ShippingZone } from './shipping-types'

export function createShippingZone(id: string, zone: ShippingZone['zone']): ShippingZone {
  return { id, zone }
}
`

const addressSolution = `import type { AddressZone } from './shipping-types'

export function createAddressZone(
  code: string,
  shipping: AddressZone['shipping']
): AddressZone {
  return { code, shipping }
}
`

export const spec: LabSpec = {
  id: '7.9',
  title: 'Задание 7.9 — Вынос общего в третий модуль применяется дважды (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/pricing.ts', content: pricingStart, role: 'editable' },
    { path: 'src/discount.ts', content: discountStart, role: 'editable' },
    { path: 'src/price-types.ts', content: priceTypesStart, role: 'editable' },
    { path: 'src/shipping.ts', content: shippingStart, role: 'editable' },
    { path: 'src/address.ts', content: addressStart, role: 'editable' },
    { path: 'src/shipping-types.ts', content: shippingTypesStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/pricing.ts', content: pricingSolution, role: 'editable' },
    { path: 'src/discount.ts', content: discountSolution, role: 'editable' },
    { path: 'src/price-types.ts', content: priceTypesSolution, role: 'editable' },
    { path: 'src/shipping.ts', content: shippingSolution, role: 'editable' },
    { path: 'src/address.ts', content: addressSolution, role: 'editable' },
    { path: 'src/shipping-types.ts', content: shippingTypesSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileExists('src/price-types.ts'),
    fileContains(
      'src/price-types.ts',
      /interface\s+PriceRule/,
      '`price-types.ts` содержит `interface PriceRule`'
    ),
    fileContains(
      'src/price-types.ts',
      /interface\s+Discount/,
      '`price-types.ts` содержит `interface Discount`'
    ),
    fileExists('src/shipping-types.ts'),
    fileContains(
      'src/shipping-types.ts',
      /interface\s+ShippingZone/,
      '`shipping-types.ts` содержит `interface ShippingZone`'
    ),
    fileContains(
      'src/shipping-types.ts',
      /interface\s+AddressZone/,
      '`shipping-types.ts` содержит `interface AddressZone`'
    ),
  ],
}
