import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 6.5 (среднее) — Развязка cross-import между виджетами.
 *
 * `widgets/header` импортирует `ToggleButton` прямо из соседнего `widgets/sidebar` —
 * cross-import виджетов одного слоя. Кнопка переключения сайдбара — не собственность
 * ни того, ни другого виджета, это самостоятельное действие пользователя. Задача:
 * опустить общий кусок в `features/sidebar-toggle` (описать его public API и
 * компонент) и переключить `Header` на импорт оттуда, а не из `widgets/sidebar`.
 */

const buttonBase = `import type { ReactNode } from 'react'

export function Button({ children }: { children: ReactNode }) {
  return <button className="btn">{children}</button>
}
`

const sidebarUi = `export function Sidebar() {
  return <aside className="sidebar">Меню</aside>
}
`
const sidebarIndex = `export { Sidebar } from './ui/Sidebar'
`

const toggleButtonStart = `// Кнопка переключения сайдбара — общий кусок для header и sidebar.
// TODO: реализуйте ToggleButton, используя базовую Button из shared/ui.
`

const toggleButtonSolution = `import { Button } from '@/shared/ui/Button'

export function ToggleButton() {
  return <Button>Меню</Button>
}
`

const toggleIndexStart = `// Public API фичи features/sidebar-toggle.
// TODO: реэкспортируйте наружу компонент ToggleButton.
`

const toggleIndexSolution = `export { ToggleButton } from './ui/ToggleButton'
`

// НАРУШЕНИЕ: header тянет ToggleButton из соседнего виджета sidebar.
const headerStart = `import { ToggleButton } from '@/widgets/sidebar'

export function Header() {
  return (
    <header className="header">
      <ToggleButton />
    </header>
  )
}
`

const headerSolution = `import { ToggleButton } from '@/features/sidebar-toggle'

export function Header() {
  return (
    <header className="header">
      <ToggleButton />
    </header>
  )
}
`

const roFiles = [
  { path: 'src/shared/ui/Button.tsx', content: buttonBase, role: 'readonly' as const },
  { path: 'src/widgets/sidebar/ui/Sidebar.tsx', content: sidebarUi, role: 'readonly' as const },
  { path: 'src/widgets/sidebar/index.ts', content: sidebarIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '6.5',
  title: 'Задание 6.5 — Развязка cross-import между виджетами (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    {
      path: 'src/features/sidebar-toggle/ui/ToggleButton.tsx',
      content: toggleButtonStart,
      role: 'editable',
    },
    { path: 'src/features/sidebar-toggle/index.ts', content: toggleIndexStart, role: 'editable' },
    { path: 'src/widgets/header/ui/Header.tsx', content: headerStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/features/sidebar-toggle/ui/ToggleButton.tsx',
      content: toggleButtonSolution,
      role: 'editable',
    },
    { path: 'src/features/sidebar-toggle/index.ts', content: toggleIndexSolution, role: 'editable' },
    { path: 'src/widgets/header/ui/Header.tsx', content: headerSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi(
      'src/features/sidebar-toggle/index.ts',
      'ToggleButton',
      './ui/ToggleButton'
    ),
    fileContains(
      'src/widgets/header/ui/Header.tsx',
      /from\s*'@\/features\/sidebar-toggle'/,
      'Header берёт ToggleButton из features/sidebar-toggle, а не из widgets/sidebar'
    ),
  ],
}
