import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 15.3 (сложное) — Несколько антипаттернов в одном модуле.
 *
 * `features/add-to-cart/index.ts` собрал сразу букет проблем: (1) бизнес-логика
 * написана прямо в барреле вместо `model/`; (2) барель тянет соседнюю фичу
 * `features/wishlist` (cross-import того же слоя); (3) он же лезет вглубь
 * `entities/cart/model/store` в обход public API; (4) `export * from './ui'`
 * бесконтрольно тащит наружу всё содержимое сегмента ui. Задача: привести модуль к
 * чистой FSD-структуре — перенести логику в `model/addToCart.ts`, убрать зависимость
 * от соседней фичи, импортировать `entities/cart` только через public API и сделать
 * барель тонким с именованными реэкспортами.
 */

const cartTypes = `export interface CartItem {
  id: string
  title: string
  qty: number
}
`
const cartStore = `import type { CartItem } from './types'

export function addItem(cart: CartItem[], item: CartItem): CartItem[] {
  return [...cart, item]
}
`
const cartIndex = `export type { CartItem } from './model/types'
export { addItem } from './model/store'
`

const wishlistModel = `export function isInWishlist(id: string): boolean {
  return false
}
`
const wishlistIndex = `export { isInWishlist } from './model/wishlist'
`

const addToCartButton = `import type { CartItem } from '@/entities/cart'

export function AddToCartButton({
  item,
  onAdd,
}: {
  item: CartItem
  onAdd: (item: CartItem) => void
}) {
  return <button onClick={() => onAdd(item)}>Добавить в корзину</button>
}
`

// НАРУШЕНИЯ: логика в барреле, cross-import соседней фичи, deep import в entities,
// export * из ui.
const indexStart = `import { isInWishlist } from '@/features/wishlist'
import { addItem } from '@/entities/cart/model/store'
import type { CartItem } from '@/entities/cart'

// TODO: вынесите handleAddToCart в model/addToCart.ts, уберите обращение
// к соседней фиче features/wishlist, импортируйте entities/cart только через
// public API, замените export * на именованные реэкспорты.
export function handleAddToCart(cart: CartItem[], item: CartItem) {
  if (isInWishlist(item.id)) {
    console.log('already in wishlist')
  }
  return addItem(cart, item)
}

export * from './ui'
`

const indexSolution = `export { handleAddToCart } from './model/addToCart'
export { AddToCartButton } from './ui/AddToCartButton'
`

const addToCartModelStart = `// TODO: перенесите сюда handleAddToCart из index.ts.
// Используйте addItem из public API @/entities/cart. Проверку wishlist убираем —
// фичи одного слоя не должны знать друг о друге; если такая композиция нужна,
// её место — слоем выше, в виджете.
`

const addToCartModelSolution = `import { addItem, type CartItem } from '@/entities/cart'

export function handleAddToCart(cart: CartItem[], item: CartItem) {
  return addItem(cart, item)
}
`

const roFiles = [
  { path: 'src/entities/cart/model/types.ts', content: cartTypes, role: 'readonly' as const },
  { path: 'src/entities/cart/model/store.ts', content: cartStore, role: 'readonly' as const },
  { path: 'src/entities/cart/index.ts', content: cartIndex, role: 'readonly' as const },
  {
    path: 'src/features/wishlist/model/wishlist.ts',
    content: wishlistModel,
    role: 'readonly' as const,
  },
  { path: 'src/features/wishlist/index.ts', content: wishlistIndex, role: 'readonly' as const },
  {
    path: 'src/features/add-to-cart/ui/AddToCartButton.tsx',
    content: addToCartButton,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '15.3',
  title: 'Задание 15.3 — Несколько антипаттернов в модуле (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/features/add-to-cart/index.ts', content: indexStart, role: 'editable' },
    {
      path: 'src/features/add-to-cart/model/addToCart.ts',
      content: addToCartModelStart,
      role: 'editable',
    },
  ],
  solution: [
    ...roFiles,
    { path: 'src/features/add-to-cart/index.ts', content: indexSolution, role: 'editable' },
    {
      path: 'src/features/add-to-cart/model/addToCart.ts',
      content: addToCartModelSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi(
      'src/features/add-to-cart/index.ts',
      'handleAddToCart',
      './model/addToCart'
    ),
    exportsFromPublicApi(
      'src/features/add-to-cart/index.ts',
      'AddToCartButton',
      './ui/AddToCartButton'
    ),
    fileContains(
      'src/features/add-to-cart/index.ts',
      /^(?:(?!export \*).)*$/s,
      'index.ts не использует `export *` — тонкий барель только с именованными реэкспортами'
    ),
    fileContains(
      'src/features/add-to-cart/index.ts',
      /^(?:(?!wishlist).)*$/s,
      'index.ts не завязан на соседнюю фичу wishlist — cross-import убран'
    ),
    fileContains(
      'src/features/add-to-cart/model/addToCart.ts',
      /addItem/,
      'Бизнес-логика вызывает addItem из public API entities/cart'
    ),
  ],
}
