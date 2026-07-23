import { exportsFromPublicApi, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 9.3 (сложное) — Несколько сегментов и барель замыкают цикл.
 *
 * Слайс `entities/product`: `model/discount.ts` ради форматирования цены лезет в
 * `ui/format.ts`, а `ui/format.ts` ради подсказки со скидкой лезет обратно в
 * `model/discount.ts`. Получается цикл `model → ui → model`, и `index.ts` слайса
 * (не трогаем) держится только на этих двух файлах.
 *
 * Разрыв: логика форматирования цены переезжает в третий, «лёгкий» модуль
 * `model/price-format.ts`, от которого зависят и `discount.ts`, и `ui/format.ts`,
 * но который сам ни от кого не зависит. Public API слайса (`getDiscount`,
 * `formatWithDiscount`) не меняется — только внутреннее устройство сегментов.
 */

const priceFormatStart = `// TODO: перенесите сюда formatPrice() из ui/format.ts —
// модели не пристало зависеть от UI, а этот модуль должен быть "лёгким":
// ни от model/discount.ts, ни от ui/format.ts он зависеть не должен.
export {}
`

const priceFormatSolution = `export function formatPrice(value: number): string {
  return '$' + value.toFixed(2)
}
`

const discountStart = `import { formatPrice } from '../ui/format' // TODO: модель не должна зависеть от UI

export function getDiscount(price: number): string {
  return formatPrice(price * 0.9)
}
`

const discountSolution = `import { formatPrice } from './price-format'

export function getDiscount(price: number): string {
  return formatPrice(price * 0.9)
}
`

const uiFormatStart = `import { getDiscount } from '../model/discount'

export function formatPrice(value: number): string {
  return '$' + value.toFixed(2)
}

export function formatWithDiscount(value: number): string {
  return formatPrice(value) + ' (' + getDiscount(value) + ')'
}
`

const uiFormatSolution = `import { formatPrice } from '../model/price-format'
import { getDiscount } from '../model/discount'

export function formatWithDiscount(value: number): string {
  return formatPrice(value) + ' (' + getDiscount(value) + ')'
}
`

const indexFile = `export { getDiscount } from './model/discount'
export { formatWithDiscount } from './ui/format'
`

export const spec: LabSpec = {
  id: '9.3',
  title: 'Задание 9.3 — Несколько сегментов и барель замыкают цикл (сложное)',
  aliases: { '@': 'src' },
  files: [
    {
      path: 'src/entities/product/model/price-format.ts',
      content: priceFormatStart,
      role: 'editable',
    },
    { path: 'src/entities/product/model/discount.ts', content: discountStart, role: 'editable' },
    { path: 'src/entities/product/ui/format.ts', content: uiFormatStart, role: 'editable' },
    { path: 'src/entities/product/index.ts', content: indexFile, role: 'readonly' },
  ],
  solution: [
    {
      path: 'src/entities/product/model/price-format.ts',
      content: priceFormatSolution,
      role: 'editable',
    },
    { path: 'src/entities/product/model/discount.ts', content: discountSolution, role: 'editable' },
    { path: 'src/entities/product/ui/format.ts', content: uiFormatSolution, role: 'editable' },
    { path: 'src/entities/product/index.ts', content: indexFile, role: 'readonly' },
  ],
  checks: [
    noRuntimeCycles(),
    exportsFromPublicApi('src/entities/product/index.ts', 'getDiscount', './model/discount'),
    exportsFromPublicApi('src/entities/product/index.ts', 'formatWithDiscount', './ui/format'),
  ],
}
