import {
  fileContains,
  importsRespectLayers,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 8.1 (простое) — Провайдер темы в app.
 *
 * `app` — не слайс-домен: у него нет user/product, только сегменты (`providers/`,
 * `routes/`, `config/`, ...). Здесь `app/providers/AppProviders.tsx` должен собрать
 * провайдер темы из `shared/ui` и обернуть им детей. Импорт идёт строго вниз:
 * app (ранг 0) → shared (ранг 5).
 */

const themeProvider = `import type { ReactNode } from 'react'

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <div className="theme-provider" data-theme="light">
      {children}
    </div>
  )
}
`

const sharedUiIndex = `export { ThemeProvider } from './ThemeProvider'
`

const appProvidersStart = `import type { ReactNode } from 'react'

// TODO: импортируйте ThemeProvider из public API '@/shared/ui'
// и оберните children в него.

export function AppProviders({ children }: { children: ReactNode }) {
  return <>{children}</>
}
`

const appProvidersSolution = `import type { ReactNode } from 'react'
import { ThemeProvider } from '@/shared/ui'

export function AppProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
`

const roFiles = [
  { path: 'src/shared/ui/ThemeProvider.tsx', content: themeProvider, role: 'readonly' as const },
  { path: 'src/shared/ui/index.ts', content: sharedUiIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '8.1',
  title: 'Задание 8.1 — Провайдер темы в app (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/app/providers/AppProviders.tsx', content: appProvidersStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/app/providers/AppProviders.tsx', content: appProvidersSolution, role: 'editable' },
  ],
  checks: [
    fileContains(
      'src/app/providers/AppProviders.tsx',
      /from\s*'@\/shared\/ui'/,
      "ThemeProvider импортируется через public API '@/shared/ui'"
    ),
    fileContains(
      'src/app/providers/AppProviders.tsx',
      /<ThemeProvider>\{children\}<\/ThemeProvider>/,
      'AppProviders оборачивает children в ThemeProvider'
    ),
    importsRespectLayers(),
  ],
}
