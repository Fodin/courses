import {
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 8.3 (сложное) — Точка сборки: несколько провайдеров и роутинг.
 *
 * `app` инициализирует сразу несколько вещей: тему и стор из `shared`, роутинг из
 * `pages` (сразу двух страниц). В `app/providers/AppProviders.tsx` и
 * `app/routes/AppRouter.tsx` полно глубоких импортов мимо public API. Задача —
 * навести порядок сразу в двух файлах: все импорты строго вниз и только через
 * index.ts соответствующих сегментов и слайсов.
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

const store = `export interface Store {
  value: number
}

export function createStore(): Store {
  return { value: 0 }
}
`
const sharedLibIndex = `export type { Store } from './store'
export { createStore } from './store'
`

const homePage = `export function HomePage() {
  return <div className="home-page">Главная</div>
}
`
const pagesHomeIndex = `export { HomePage } from './ui/HomePage'
`

const settingsPage = `export function SettingsPage() {
  return <div className="settings-page">Настройки</div>
}
`
const pagesSettingsIndex = `export { SettingsPage } from './ui/SettingsPage'
`

const appProvidersStart = `import type { ReactNode } from 'react'
import { ThemeProvider } from '@/shared/ui/ThemeProvider'
import { createStore } from '@/shared/lib/store'

const store = createStore()

// TODO: импортируйте ThemeProvider и createStore через public API сегментов
// ('@/shared/ui' и '@/shared/lib'), а не из внутренних файлов.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <span data-store-value={store.value}>{children}</span>
    </ThemeProvider>
  )
}
`

const appProvidersSolution = `import type { ReactNode } from 'react'
import { ThemeProvider } from '@/shared/ui'
import { createStore } from '@/shared/lib'

const store = createStore()

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <span data-store-value={store.value}>{children}</span>
    </ThemeProvider>
  )
}
`

const appRouterStart = `import { HomePage } from '@/pages/home/ui/HomePage'
import { SettingsPage } from '@/pages/settings/ui/SettingsPage'

// TODO: подключите обе страницы через их public API
// ('@/pages/home' и '@/pages/settings'), а не через внутренний сегмент ui/.
export function AppRouter({ route }: { route: 'home' | 'settings' }) {
  return route === 'home' ? <HomePage /> : <SettingsPage />
}
`

const appRouterSolution = `import { HomePage } from '@/pages/home'
import { SettingsPage } from '@/pages/settings'

export function AppRouter({ route }: { route: 'home' | 'settings' }) {
  return route === 'home' ? <HomePage /> : <SettingsPage />
}
`

const roFiles = [
  { path: 'src/shared/ui/ThemeProvider.tsx', content: themeProvider, role: 'readonly' as const },
  { path: 'src/shared/ui/index.ts', content: sharedUiIndex, role: 'readonly' as const },
  { path: 'src/shared/lib/store.ts', content: store, role: 'readonly' as const },
  { path: 'src/shared/lib/index.ts', content: sharedLibIndex, role: 'readonly' as const },
  { path: 'src/pages/home/ui/HomePage.tsx', content: homePage, role: 'readonly' as const },
  { path: 'src/pages/home/index.ts', content: pagesHomeIndex, role: 'readonly' as const },
  { path: 'src/pages/settings/ui/SettingsPage.tsx', content: settingsPage, role: 'readonly' as const },
  { path: 'src/pages/settings/index.ts', content: pagesSettingsIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '8.3',
  title: 'Задание 8.3 — Точка сборки: провайдеры и роутинг (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/app/providers/AppProviders.tsx', content: appProvidersStart, role: 'editable' },
    { path: 'src/app/routes/AppRouter.tsx', content: appRouterStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/app/providers/AppProviders.tsx', content: appProvidersSolution, role: 'editable' },
    { path: 'src/app/routes/AppRouter.tsx', content: appRouterSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/app/providers/AppProviders.tsx',
      /from\s*'@\/shared\/ui'/,
      "ThemeProvider импортируется через public API '@/shared/ui'"
    ),
    fileContains(
      'src/app/providers/AppProviders.tsx',
      /from\s*'@\/shared\/lib'/,
      "createStore импортируется через public API '@/shared/lib'"
    ),
    fileContains(
      'src/app/routes/AppRouter.tsx',
      /from\s*'@\/pages\/home'/,
      "HomePage импортируется через public API '@/pages/home'"
    ),
    fileContains(
      'src/app/routes/AppRouter.tsx',
      /from\s*'@\/pages\/settings'/,
      "SettingsPage импортируется через public API '@/pages/settings'"
    ),
  ],
}
