import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 12.2 (среднее) — Глубокий импорт мимо public API.
 *
 * `widgets/product-card` тянет тип `Product` напрямую из `entities/product/model`,
 * а у `entities/product` даже нет заполненного `index.ts`. Задача: завести public
 * API сущности и переключить виджет на импорт из корня слайса.
 */

const productTypes = `export interface Product {
  id: string
  title: string
  price: number
}
`

const productIndexStart = `// Public API слайса entities/product.
// TODO: реэкспортируйте тип Product из ./model/types.
export {}
`

const productIndexSolution = `export type { Product } from './model/types'
`

// НАРУШЕНИЕ: виджет лезет во внутренний сегмент чужого слайса мимо index.ts.
const productCardStart = `import type { Product } from '@/entities/product/model/types'

interface Props {
  product: Product
}

export function describeProduct({ product }: Props): string {
  return \`\${product.title} — \${product.price}₽\`
}
`

const productCardSolution = `import type { Product } from '@/entities/product'

interface Props {
  product: Product
}

export function describeProduct({ product }: Props): string {
  return \`\${product.title} — \${product.price}₽\`
}
`

const roFiles = [
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '12.2',
  title: 'Задание 12.2 — Глубокий импорт мимо public API (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/product/index.ts', content: productIndexStart, role: 'editable' },
    {
      path: 'src/widgets/product-card/ui/describe-product.ts',
      content: productCardStart,
      role: 'editable',
    },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/product/index.ts', content: productIndexSolution, role: 'editable' },
    {
      path: 'src/widgets/product-card/ui/describe-product.ts',
      content: productCardSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/entities/product/index.ts', 'Product', './model/types'),
    fileContains(
      'src/widgets/product-card/ui/describe-product.ts',
      /from\s+'@\/entities\/product'/,
      'Виджет импортирует Product из public API entities/product, а не из его сегмента'
    ),
  ],
}
