import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 5.1 (простое) — Фича как пользовательский сценарий.
 *
 * `features/add-to-cart` — типичная фича: действие «добавить товар в корзину».
 * Ей нужна сущность `entities/cart` (куда класть товар) и переиспользуемая кнопка
 * из `shared/ui`. Задача: оформить кнопку так, чтобы она брала обе зависимости
 * через их public API (а не вглубь сегментов), и собрать public API самой фичи.
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

const sharedButton = `export function Button({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button className="btn" onClick={onClick}>
      {children}
    </button>
  )
}
`
const sharedUiIndex = `export { Button } from './Button'
`

// НАРУШЕНИЕ: фича лезет во внутренние сегменты entities/cart и shared/ui напрямую.
const addToCartButtonStart = `import { cartStore } from '@/entities/cart/model/store'
import { Button } from '@/shared/ui/Button'

export function AddToCartButton({ productId }: { productId: string }) {
  return <Button onClick={() => cartStore.add(productId)}>В корзину</Button>
}
`

const addToCartButtonSolution = `import { cartStore } from '@/entities/cart'
import { Button } from '@/shared/ui'

export function AddToCartButton({ productId }: { productId: string }) {
  return <Button onClick={() => cartStore.add(productId)}>В корзину</Button>
}
`

// НАРУШЕНИЕ: у фичи нет public API — index.ts пуст.
const featureIndexStart = `// Public API фичи features/add-to-cart.
// TODO: реэкспортируйте AddToCartButton из ./ui/AddToCartButton.
`
const featureIndexSolution = `export { AddToCartButton } from './ui/AddToCartButton'
`

const roFiles = [
  { path: 'src/entities/cart/model/store.ts', content: cartStore, role: 'readonly' as const },
  { path: 'src/entities/cart/index.ts', content: cartIndex, role: 'readonly' as const },
  { path: 'src/shared/ui/Button.tsx', content: sharedButton, role: 'readonly' as const },
  { path: 'src/shared/ui/index.ts', content: sharedUiIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '5.1',
  title: 'Задание 5.1 — Фича как сценарий: add-to-cart (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    {
      path: 'src/features/add-to-cart/ui/AddToCartButton.tsx',
      content: addToCartButtonStart,
      role: 'editable',
    },
    { path: 'src/features/add-to-cart/index.ts', content: featureIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/features/add-to-cart/ui/AddToCartButton.tsx',
      content: addToCartButtonSolution,
      role: 'editable',
    },
    { path: 'src/features/add-to-cart/index.ts', content: featureIndexSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi(
      'src/features/add-to-cart/index.ts',
      'AddToCartButton',
      './ui/AddToCartButton'
    ),
    fileContains(
      'src/features/add-to-cart/ui/AddToCartButton.tsx',
      /cartStore\.add\(productId\)/,
      'Кнопка вызывает cartStore.add — фича действительно собирает сценарий из сущности'
    ),
  ],
}
