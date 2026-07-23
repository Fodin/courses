import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 14.4 (простое) — Оформляем действие как фичу.
 *
 * Действие «добавить в корзину» размазано между `src/utils/cartHandlers.ts`
 * (обработчик) и `src/components/AddToCartButton.tsx` (кнопка). Это не
 * переиспользуемый примитив и не сущность — это сценарий пользователя, то
 * есть фича. Задача: собрать слайс `features/add-to-cart` и переключить
 * потребителя на его public API.
 */

// Legacy-источники.
const legacyHandler = `export function addToCart(productId: string): void {
  console.log('cart: added', productId)
}
`

const legacyButton = `import { addToCart } from '../utils/cartHandlers'

export function AddToCartButton({ productId }: { productId: string }) {
  return <button onClick={() => addToCart(productId)}>В корзину</button>
}
`

// Целевые файлы фичи.
const modelStart = `// TODO: перенесите сюда функцию addToCart из 'src/utils/cartHandlers.ts'.
`
const modelSolution = `export function addToCart(productId: string): void {
  console.log('cart: added', productId)
}
`

const uiStart = `// TODO: перенесите сюда кнопку из 'src/components/AddToCartButton.tsx'.
// Обработчик берите из '../model/addToCart' (свой слайс).
`
const uiSolution = `import { addToCart } from '../model/addToCart'

export function AddToCartButton({ productId }: { productId: string }) {
  return <button onClick={() => addToCart(productId)}>В корзину</button>
}
`

const indexStart = `// Public API слайса features/add-to-cart.
// TODO: реэкспортируйте AddToCartButton.
`
const indexSolution = `export { AddToCartButton } from './ui/AddToCartButton'
`

// Потребитель — страница, сейчас тянущая legacy-кнопку напрямую.
const consumerStart = `import { AddToCartButton } from '@/components/AddToCartButton'

export function ProductPage({ productId }: { productId: string }) {
  return (
    <section>
      <h1>Товар</h1>
      <AddToCartButton productId={productId} />
    </section>
  )
}
`

const consumerSolution = `import { AddToCartButton } from '@/features/add-to-cart'

export function ProductPage({ productId }: { productId: string }) {
  return (
    <section>
      <h1>Товар</h1>
      <AddToCartButton productId={productId} />
    </section>
  )
}
`

export const spec: FsdTaskSpec = {
  id: '14.4',
  title: 'Задание 14.4 — Оформляем действие как фичу (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/utils/cartHandlers.ts', content: legacyHandler, role: 'readonly' },
    { path: 'src/components/AddToCartButton.tsx', content: legacyButton, role: 'readonly' },
    { path: 'src/features/add-to-cart/model/addToCart.ts', content: modelStart, role: 'editable' },
    { path: 'src/features/add-to-cart/ui/AddToCartButton.tsx', content: uiStart, role: 'editable' },
    { path: 'src/features/add-to-cart/index.ts', content: indexStart, role: 'editable' },
    { path: 'src/pages/product/ui/ProductPage.tsx', content: consumerStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/utils/cartHandlers.ts', content: legacyHandler, role: 'readonly' },
    { path: 'src/components/AddToCartButton.tsx', content: legacyButton, role: 'readonly' },
    {
      path: 'src/features/add-to-cart/model/addToCart.ts',
      content: modelSolution,
      role: 'editable',
    },
    {
      path: 'src/features/add-to-cart/ui/AddToCartButton.tsx',
      content: uiSolution,
      role: 'editable',
    },
    { path: 'src/features/add-to-cart/index.ts', content: indexSolution, role: 'editable' },
    { path: 'src/pages/product/ui/ProductPage.tsx', content: consumerSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/features/add-to-cart/model/addToCart.ts',
      /export function addToCart/,
      '`features/add-to-cart/model/addToCart.ts` содержит перенесённую функцию'
    ),
    exportsFromPublicApi('src/features/add-to-cart/index.ts', 'AddToCartButton', './ui/AddToCartButton'),
    fileContains(
      'src/pages/product/ui/ProductPage.tsx',
      /from\s*'@\/features\/add-to-cart'/,
      'ProductPage импортирует AddToCartButton из public API `@/features/add-to-cart`'
    ),
  ],
}
