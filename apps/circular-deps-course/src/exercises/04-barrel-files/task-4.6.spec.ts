import { fileContains, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 4.6 (сложное) — вложенные barrel'ы с циклом, несколько editable-файлов.
 *
 * `widgets/index.ts` — верхний barrel, реэкспортирует два вложенных
 * саб-пакета (`widgets/cart`, `widgets/wishlist`) и общую утилиту `shared.ts`.
 * Три отдельные проблемы завязывают весь граф в цикл:
 *  1. `cart/component.ts` берёт `formatCount` не из `../shared`, а из
 *     верхнего barrel `../../widgets` — цикл `widgets/index → cart/index →
 *     cart/component → widgets/index`.
 *  2. `wishlist/component.ts` — та же ошибка через верхний barrel.
 *  3. `cart/index.ts` «для удобства» реэкспортирует ещё и соседний барrel
 *     `wishlist` — расширяет площадь цикла и держит cart в зависимости от
 *     wishlist без всякой необходимости.
 *
 * Нужно распутать граф, переписав импорты сразу в трёх файлах — верхний
 * barrel `widgets/index.ts` при этом не трогаем, это корректная точка входа.
 */

const sharedContent = `export function formatCount(n: number): string {
  return n + ' items'
}
`

const widgetsIndexContent = `import { CartWidget } from './cart'
import { WishlistWidget } from './wishlist'
import { formatCount } from './shared'

export { CartWidget, WishlistWidget, formatCount }
`

const cartIndexStart = `import { CartWidget } from './component'
import { WishlistWidget } from '../wishlist' // TODO: убери эту связь — cart не должен реэкспортировать чужой барrel wishlist

export { CartWidget, WishlistWidget }
`

const cartIndexSolution = `import { CartWidget } from './component'

export { CartWidget }
`

const cartComponentStart = `import { formatCount } from '../../widgets' // TODO: импортируй formatCount напрямую из '../shared', а не через верхний barrel

export function CartWidget(n: number): string {
  return 'cart:' + formatCount(n)
}
`

const cartComponentSolution = `import { formatCount } from '../shared'

export function CartWidget(n: number): string {
  return 'cart:' + formatCount(n)
}
`

const wishlistIndexContent = `import { WishlistWidget } from './component'

export { WishlistWidget }
`

const wishlistComponentStart = `import { formatCount } from '../../widgets' // TODO: импортируй formatCount напрямую из '../shared', а не через верхний barrel

export function WishlistWidget(n: number): string {
  return 'wishlist:' + formatCount(n)
}
`

const wishlistComponentSolution = `import { formatCount } from '../shared'

export function WishlistWidget(n: number): string {
  return 'wishlist:' + formatCount(n)
}
`

export const spec: LabSpec = {
  id: '4.6',
  title: 'Задание 4.6 — Вложенные barrel и распутывание графа (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/widgets/shared.ts', content: sharedContent, role: 'readonly' },
    { path: 'src/widgets/index.ts', content: widgetsIndexContent, role: 'readonly' },
    { path: 'src/widgets/cart/index.ts', content: cartIndexStart, role: 'editable' },
    { path: 'src/widgets/cart/component.ts', content: cartComponentStart, role: 'editable' },
    { path: 'src/widgets/wishlist/index.ts', content: wishlistIndexContent, role: 'readonly' },
    {
      path: 'src/widgets/wishlist/component.ts',
      content: wishlistComponentStart,
      role: 'editable',
    },
  ],
  solution: [
    { path: 'src/widgets/shared.ts', content: sharedContent, role: 'readonly' },
    { path: 'src/widgets/index.ts', content: widgetsIndexContent, role: 'readonly' },
    { path: 'src/widgets/cart/index.ts', content: cartIndexSolution, role: 'editable' },
    { path: 'src/widgets/cart/component.ts', content: cartComponentSolution, role: 'editable' },
    { path: 'src/widgets/wishlist/index.ts', content: wishlistIndexContent, role: 'readonly' },
    {
      path: 'src/widgets/wishlist/component.ts',
      content: wishlistComponentSolution,
      role: 'editable',
    },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/widgets/cart/component.ts',
      /from\s*'\.\.\/shared'/,
      "cart/component.ts берёт formatCount напрямую из '../shared'"
    ),
    fileContains(
      'src/widgets/wishlist/component.ts',
      /from\s*'\.\.\/shared'/,
      "wishlist/component.ts берёт formatCount напрямую из '../shared'"
    ),
    fileContains(
      'src/widgets/cart/index.ts',
      /^(?:(?!wishlist).)*$/s,
      'cart/index.ts больше не реэкспортирует чужой barrel wishlist'
    ),
  ],
}
