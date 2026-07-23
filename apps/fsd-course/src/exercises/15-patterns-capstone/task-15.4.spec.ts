import {
  exportsFromPublicApi,
  fileContains,
  fileExists,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 15.4 (простое) — Капстоун, шаг 1: собрать слайс-сущность с public API.
 *
 * Слайс `entities/review` уже содержит сегменты `model/` и `ui/`, но не закрыт
 * входной дверью. Виджет-потребитель тянет его глубокими импортами. Задача: описать
 * `index.ts` (тип `Review` + компонент `ReviewItem`) и переключить потребителя на
 * public API.
 */

const reviewTypes = `export interface Review {
  id: string
  text: string
  rating: number
}
`

const reviewItem = `import type { Review } from '../model/types'

export function ReviewItem({ review }: { review: Review }) {
  return (
    <li className="review-item">
      <strong>{review.rating}★</strong> {review.text}
    </li>
  )
}
`

const indexStart = `// Public API слайса entities/review.
// TODO: реэкспортируйте наружу тип Review и компонент ReviewItem.
`

const indexSolution = `export type { Review } from './model/types'
export { ReviewItem } from './ui/ReviewItem'
`

// НАРУШЕНИЕ: виджет лезет во внутренние сегменты сущности.
const reviewListStart = `import type { Review } from '@/entities/review/model/types'
import { ReviewItem } from '@/entities/review/ui/ReviewItem'

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <ul>
      {reviews.map(r => (
        <ReviewItem key={r.id} review={r} />
      ))}
    </ul>
  )
}
`

const reviewListSolution = `import { ReviewItem, type Review } from '@/entities/review'

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <ul>
      {reviews.map(r => (
        <ReviewItem key={r.id} review={r} />
      ))}
    </ul>
  )
}
`

const roFiles = [
  { path: 'src/entities/review/model/types.ts', content: reviewTypes, role: 'readonly' as const },
  { path: 'src/entities/review/ui/ReviewItem.tsx', content: reviewItem, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '15.4',
  title: 'Задание 15.4 — Собрать слайс-сущность (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/review/index.ts', content: indexStart, role: 'editable' },
    {
      path: 'src/widgets/review-list/ui/ReviewList.tsx',
      content: reviewListStart,
      role: 'editable',
    },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/review/index.ts', content: indexSolution, role: 'editable' },
    {
      path: 'src/widgets/review-list/ui/ReviewList.tsx',
      content: reviewListSolution,
      role: 'editable',
    },
  ],
  checks: [
    fileExists('src/entities/review/index.ts'),
    exportsFromPublicApi('src/entities/review/index.ts', 'Review', './model/types'),
    exportsFromPublicApi('src/entities/review/index.ts', 'ReviewItem', './ui/ReviewItem'),
    noDeepImport(),
    importsRespectLayers(),
    fileContains(
      'src/widgets/review-list/ui/ReviewList.tsx',
      /from\s*'@\/entities\/review'/,
      'Виджет импортирует сущность через public API `@/entities/review`'
    ),
  ],
}
