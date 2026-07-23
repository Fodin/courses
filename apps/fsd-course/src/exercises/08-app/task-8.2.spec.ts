import {
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 8.2 (среднее) — Роутинг в app.
 *
 * `app/routes/AppRouter.tsx` подключает страницу `pages/home`. Страница уже закрыта
 * public API (`index.ts`, только чтение), но роутер лезет во внутренний сегмент
 * `ui/` в обход него — deep import. Задача: переключиться на `@/pages/home`.
 */

const homePage = `export function HomePage() {
  return <div className="home-page">Главная</div>
}
`

const pagesHomeIndex = `export { HomePage } from './ui/HomePage'
`

const appRouterStart = `import { HomePage } from '@/pages/home/ui/HomePage'

// TODO: подключите страницу через её public API '@/pages/home',
// а не через внутренний сегмент ui/.

export function AppRouter() {
  return <HomePage />
}
`

const appRouterSolution = `import { HomePage } from '@/pages/home'

export function AppRouter() {
  return <HomePage />
}
`

const roFiles = [
  { path: 'src/pages/home/ui/HomePage.tsx', content: homePage, role: 'readonly' as const },
  { path: 'src/pages/home/index.ts', content: pagesHomeIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '8.2',
  title: 'Задание 8.2 — Роутинг в app (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/app/routes/AppRouter.tsx', content: appRouterStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/app/routes/AppRouter.tsx', content: appRouterSolution, role: 'editable' },
  ],
  checks: [
    noDeepImport(),
    importsRespectLayers(),
    fileContains(
      'src/app/routes/AppRouter.tsx',
      /from\s*'@\/pages\/home'/,
      "AppRouter импортирует HomePage через public API '@/pages/home'"
    ),
  ],
}
