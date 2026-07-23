import { exportsFromPublicApi, fileExists, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 3.1 (простое) — Public API переиспользуемого компонента.
 *
 * Сегмент `shared/ui` уже содержит готовый компонент `Button` (и его тип пропов
 * `ButtonProps`), но у сегмента нет публичного входа. Задача: описать `index.ts`,
 * чтобы снаружи компонент был доступен одной строкой `import { Button } from '@/shared/ui'`.
 */

const buttonTsx = `export interface ButtonProps {
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

const indexStart = `// Public API сегмента shared/ui.
// TODO: реэкспортируйте наружу компонент Button и тип ButtonProps,
// чтобы другие слои не лезли внутрь shared/ui/Button.tsx напрямую.
`

const indexSolution = `export { Button } from './Button'
export type { ButtonProps } from './Button'
`

export const spec: FsdTaskSpec = {
  id: '3.1',
  title: 'Задание 3.1 — Public API переиспользуемого компонента (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/shared/ui/Button.tsx', content: buttonTsx, role: 'readonly' },
    { path: 'src/shared/ui/index.ts', content: indexStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/shared/ui/Button.tsx', content: buttonTsx, role: 'readonly' },
    { path: 'src/shared/ui/index.ts', content: indexSolution, role: 'editable' },
  ],
  checks: [
    fileExists('src/shared/ui/index.ts'),
    exportsFromPublicApi('src/shared/ui/index.ts', 'Button', './Button'),
    exportsFromPublicApi('src/shared/ui/index.ts', 'ButtonProps', './Button'),
  ],
}
