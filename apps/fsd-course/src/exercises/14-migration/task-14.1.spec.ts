import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 14.1 (простое) — Переносим примитив в shared.
 *
 * Legacy-компонент `src/components/Button.tsx` используется в нескольких местах
 * проекта. Задача первого шага миграции: перенести его в `shared/ui/Button.tsx`,
 * закрыть сегмент public API и переключить импорт потребителя со старого пути
 * на новый.
 */

// Legacy-источник — отсюда переносим код. Не редактируется, служит образцом.
const legacyButton = `export interface ButtonProps {
  label: string
  onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button className="legacy-button" onClick={onClick}>
      {label}
    </button>
  )
}
`

// Целевой файл — сюда переносим код из legacy.
const sharedButtonStart = `// TODO: перенесите сюда компонент Button и тип ButtonProps
// из legacy-файла 'src/components/Button.tsx'.
`

const sharedButtonSolution = `export interface ButtonProps {
  label: string
  onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button className="ui-button" onClick={onClick}>
      {label}
    </button>
  )
}
`

const sharedIndexStart = `// Public API сегмента shared/ui.
// TODO: реэкспортируйте наружу Button и ButtonProps.
`

const sharedIndexSolution = `export { Button } from './Button'
export type { ButtonProps } from './Button'
`

// Потребитель, который сейчас тянет компонент из legacy-пути.
const consumerStart = `import { Button } from '@/components/Button'

export function HomePage() {
  return (
    <main>
      <h1>Каталог</h1>
      <Button label="Обновить" onClick={() => console.log('refresh')} />
    </main>
  )
}
`

const consumerSolution = `import { Button } from '@/shared/ui'

export function HomePage() {
  return (
    <main>
      <h1>Каталог</h1>
      <Button label="Обновить" onClick={() => console.log('refresh')} />
    </main>
  )
}
`

export const spec: FsdTaskSpec = {
  id: '14.1',
  title: 'Задание 14.1 — Переносим примитив в shared (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/components/Button.tsx', content: legacyButton, role: 'readonly' },
    { path: 'src/shared/ui/Button.tsx', content: sharedButtonStart, role: 'editable' },
    { path: 'src/shared/ui/index.ts', content: sharedIndexStart, role: 'editable' },
    { path: 'src/pages/home/ui/HomePage.tsx', content: consumerStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/components/Button.tsx', content: legacyButton, role: 'readonly' },
    { path: 'src/shared/ui/Button.tsx', content: sharedButtonSolution, role: 'editable' },
    { path: 'src/shared/ui/index.ts', content: sharedIndexSolution, role: 'editable' },
    { path: 'src/pages/home/ui/HomePage.tsx', content: consumerSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/shared/ui/Button.tsx',
      /export function Button/,
      '`shared/ui/Button.tsx` содержит перенесённый компонент Button'
    ),
    exportsFromPublicApi('src/shared/ui/index.ts', 'Button', './Button'),
    fileContains(
      'src/pages/home/ui/HomePage.tsx',
      /from\s*'@\/shared\/ui'/,
      'HomePage импортирует Button из public API `@/shared/ui`, а не из legacy-пути'
    ),
  ],
}
