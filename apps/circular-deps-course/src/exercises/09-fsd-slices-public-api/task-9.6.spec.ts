import {
  exportsFromPublicApi,
  fileContains,
  noDeepImport,
  noRuntimeCycles,
  type LabSpec,
} from 'src/engine'

/**
 * Задание 9.6 (сложное) — Три слайса, глубокие импорты и цикл одновременно.
 *
 * `entities/user`, `entities/review`, `entities/product` образуют цикл длиной 3,
 * причём каждый переход — ГЛУБОКИЙ импорт мимо public API:
 * `user → review → product → user`. У `entities/user` вдобавок ещё и не собран
 * public API — `index.ts` пуст.
 *
 * Разрыв: каждая сущность хранит соседа по идентификатору (`latestReviewId`,
 * `productId`, `addedById`), а не вложенным объектом — вместе с полями пропадают
 * и глубокие импорты, и цикл. Плюс — нужно собрать public API `entities/user`,
 * реэкспортировав `User` из `index.ts`.
 */

const userStart = `import { Review } from '@/entities/review/model/review' // TODO: убрать — user не обязан хранить целый Review

export interface User {
  id: string
  name: string
  latestReview: Review
}
`

const userSolution = `export interface User {
  id: string
  name: string
  latestReviewId: string
}
`

const reviewStart = `import { Product } from '@/entities/product/model/product' // TODO: убрать — review не обязан хранить целый Product

export interface Review {
  id: string
  text: string
  product: Product
}
`

const reviewSolution = `export interface Review {
  id: string
  text: string
  productId: string
}
`

const reviewIndex = `export { Review } from './model/review'
`

const productStart = `import { User } from '@/entities/user/model/user' // TODO: убрать — product не обязан хранить целого User

export interface Product {
  id: string
  title: string
  addedBy: User
}
`

const productSolution = `export interface Product {
  id: string
  title: string
  addedById: string
}
`

const productIndex = `export { Product } from './model/product'
`

const userIndexStart = `// TODO: соберите public API слайса — реэкспортируйте User из './model/user'
`

const userIndexSolution = `export { User } from './model/user'
`

export const spec: LabSpec = {
  id: '9.6',
  title: 'Задание 9.6 — Три слайса: глубокие импорты и цикл разом (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/user/model/user.ts', content: userStart, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: userIndexStart, role: 'editable' },
    { path: 'src/entities/review/model/review.ts', content: reviewStart, role: 'editable' },
    { path: 'src/entities/review/index.ts', content: reviewIndex, role: 'readonly' },
    { path: 'src/entities/product/model/product.ts', content: productStart, role: 'editable' },
    { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' },
  ],
  solution: [
    { path: 'src/entities/user/model/user.ts', content: userSolution, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: userIndexSolution, role: 'editable' },
    { path: 'src/entities/review/model/review.ts', content: reviewSolution, role: 'editable' },
    { path: 'src/entities/review/index.ts', content: reviewIndex, role: 'readonly' },
    { path: 'src/entities/product/model/product.ts', content: productSolution, role: 'editable' },
    { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' },
  ],
  checks: [
    noDeepImport(),
    noRuntimeCycles(),
    exportsFromPublicApi('src/entities/user/index.ts', 'User', './model/user'),
    fileContains(
      'src/entities/user/model/user.ts',
      /latestReviewId\s*:/,
      'User хранит latestReviewId, а не вложенный Review'
    ),
    fileContains(
      'src/entities/review/model/review.ts',
      /productId\s*:/,
      'Review хранит productId, а не вложенный Product'
    ),
    fileContains(
      'src/entities/product/model/product.ts',
      /addedById\s*:/,
      'Product хранит addedById, а не вложенного User'
    ),
  ],
}
