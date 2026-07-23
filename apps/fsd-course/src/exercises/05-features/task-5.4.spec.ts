import { fileContains, importsRespectLayers, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 5.4 (простое) — Фича не импортирует вверх.
 *
 * `features/toggle-favorite` подглядывает у `widgets/product-card` константу
 * ширины карточки, чтобы «подогнать» размер иконки. Это импорт вверх по стеку:
 * `widgets` стоит выше `features`, и фича не должна ничего о нём знать. Задача:
 * убрать зависимость от widgets — фича сама решает вопрос размера своей иконки.
 */

const productCardConstants = `export const CARD_WIDTH = 240
`
const productCardIndex = `export { CARD_WIDTH } from './lib/constants'
`

// НАРУШЕНИЕ: features импортирует из widgets — слой выше по стеку.
const toggleFavoriteStart = `import { CARD_WIDTH } from '@/widgets/product-card'

// TODO: уберите импорт из widgets/product-card — фича не должна знать о виджете,
// который её использует. Определите размер иконки локально, в самой фиче.
export function ToggleFavoriteButton({ active }: { active: boolean }) {
  const iconSize = CARD_WIDTH / 10
  return (
    <button style={{ fontSize: iconSize }} aria-pressed={active}>
      {active ? '★' : '☆'}
    </button>
  )
}
`

const toggleFavoriteSolution = `const ICON_SIZE = 24

export function ToggleFavoriteButton({ active }: { active: boolean }) {
  return (
    <button style={{ fontSize: ICON_SIZE }} aria-pressed={active}>
      {active ? '★' : '☆'}
    </button>
  )
}
`

const roFiles = [
  {
    path: 'src/widgets/product-card/lib/constants.ts',
    content: productCardConstants,
    role: 'readonly' as const,
  },
  {
    path: 'src/widgets/product-card/index.ts',
    content: productCardIndex,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '5.4',
  title: 'Задание 5.4 — Фича не импортирует вверх (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    {
      path: 'src/features/toggle-favorite/ui/ToggleFavoriteButton.tsx',
      content: toggleFavoriteStart,
      role: 'editable',
    },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/features/toggle-favorite/ui/ToggleFavoriteButton.tsx',
      content: toggleFavoriteSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    fileContains(
      'src/features/toggle-favorite/ui/ToggleFavoriteButton.tsx',
      /ICON_SIZE/,
      'Размер иконки определяется локально в фиче, а не берётся из виджета'
    ),
  ],
}
