import { exportsFromPublicApi, noDeepImport, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 9.4 (простое) — Глубокий импорт мимо public API.
 *
 * `features/cart` считает сумму корзины, но берёт `calcPrice` не через public API
 * `entities/product`, а напрямую из внутреннего сегмента `model/price.ts`. Это
 * обход публичной границы слайса: сейчас граф импортов кажется безопасным, но
 * `entities/product` больше не может свободно менять свою внутреннюю структуру,
 * не сломав `features/cart`, а инструменты анализа (madge, dependency-cruiser)
 * не увидят эту «тайную тропу» на диаграмме слоёв.
 */

const priceFile = `export function calcPrice(base: number, qty: number): number {
  return base * qty
}
`

const productIndex = `export { calcPrice } from './model/price'
`

const cartStart = `import { calcPrice } from '@/entities/product/model/price' // TODO: обход public API — импортируйте из 'entities/product'

export function getCartTotal(base: number, qty: number): number {
  return calcPrice(base, qty)
}
`

const cartSolution = `import { calcPrice } from '@/entities/product'

export function getCartTotal(base: number, qty: number): number {
  return calcPrice(base, qty)
}
`

const cartIndex = `export { getCartTotal } from './model/total'
`

export const spec: LabSpec = {
  id: '9.4',
  title: 'Задание 9.4 — Глубокий импорт мимо public API (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/product/model/price.ts', content: priceFile, role: 'readonly' },
    { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' },
    { path: 'src/features/cart/model/total.ts', content: cartStart, role: 'editable' },
    { path: 'src/features/cart/index.ts', content: cartIndex, role: 'readonly' },
  ],
  solution: [
    { path: 'src/entities/product/model/price.ts', content: priceFile, role: 'readonly' },
    { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' },
    { path: 'src/features/cart/model/total.ts', content: cartSolution, role: 'editable' },
    { path: 'src/features/cart/index.ts', content: cartIndex, role: 'readonly' },
  ],
  checks: [
    noDeepImport(),
    noRuntimeCycles(),
    exportsFromPublicApi('src/entities/product/index.ts', 'calcPrice', './model/price'),
  ],
}
