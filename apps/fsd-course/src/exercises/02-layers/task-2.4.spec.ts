import { exportsFromPublicApi, fileContains, importsRespectLayers, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 2.4 (простое) — Бизнес-код не место в shared.
 *
 * `shared/ui/AddToCartButton.tsx` знает про `entities/cart` — это бизнес-функция,
 * а не переиспользуемый UI без домена. Задача: перенести компонент в
 * `features/add-to-cart` (там импорт entities — вниз по стеку и легален), а
 * `shared`-файл очистить от знания о сущности.
 */

const cartStore = `export const cartStore = {
  items: [] as string[],
  add(productId: string) {
    this.items.push(productId)
  },
}
`

const cartIndex = `export { cartStore } from './model/store'
`

// НАРУШЕНИЕ: shared импортирует entities — бизнес-код закрался в общий слой.
const sharedButtonStart = `import { cartStore } from '@/entities/cart'

// TODO: перенесите этот компонент в features/add-to-cart и очистите этот файл —
// shared не должен знать про доменные сущности вроде cartStore.
export function AddToCartButton({ productId }: { productId: string }) {
  return <button onClick={() => cartStore.add(productId)}>В корзину</button>
}
`

const sharedButtonSolution = `// Компонент перенесён в features/add-to-cart — это бизнес-функциональность
// (добавление товара в корзину), а не переиспользуемый UI без домена.
// shared больше не знает про cartStore.
`

const featureButtonStart = `// TODO: перенесите сюда компонент кнопки "В корзину" из
// shared/ui/AddToCartButton.tsx. Импорт '@/entities/cart' здесь разрешён —
// features может опускаться вниз, к entities.
`

const featureButtonSolution = `import { cartStore } from '@/entities/cart'

export function AddToCartButton({ productId }: { productId: string }) {
  return <button onClick={() => cartStore.add(productId)}>В корзину</button>
}
`

const featureIndexStart = `// TODO: реэкспортируйте AddToCartButton из ./ui/AddToCartButton
`

const featureIndexSolution = `export { AddToCartButton } from './ui/AddToCartButton'
`

const roFiles = [
  { path: 'src/entities/cart/model/store.ts', content: cartStore, role: 'readonly' as const },
  { path: 'src/entities/cart/index.ts', content: cartIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '2.4',
  title: 'Задание 2.4 — Бизнес-код не место в shared (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/shared/ui/AddToCartButton.tsx', content: sharedButtonStart, role: 'editable' },
    {
      path: 'src/features/add-to-cart/ui/AddToCartButton.tsx',
      content: featureButtonStart,
      role: 'editable',
    },
    { path: 'src/features/add-to-cart/index.ts', content: featureIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/shared/ui/AddToCartButton.tsx', content: sharedButtonSolution, role: 'editable' },
    {
      path: 'src/features/add-to-cart/ui/AddToCartButton.tsx',
      content: featureButtonSolution,
      role: 'editable',
    },
    { path: 'src/features/add-to-cart/index.ts', content: featureIndexSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    exportsFromPublicApi(
      'src/features/add-to-cart/index.ts',
      'AddToCartButton',
      './ui/AddToCartButton'
    ),
    fileContains(
      'src/features/add-to-cart/ui/AddToCartButton.tsx',
      /cartStore\.add\(productId\)/,
      'Кнопка добавления в корзину живёт в features и вызывает cartStore.add'
    ),
  ],
}
