import { fileContains, importsRespectLayers, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 8.4 (простое) — Ничто не импортирует app.
 *
 * `app` — вершина графа (ранг 0): более высокого слоя нет, поэтому ЛЮБОЙ импорт
 * ИЗ app в другой слой — это импорт «вверх». `pages/home` тянет константу маршрута
 * прямо из `app/config/routes` — так делать нельзя. Задача: убрать зависимость,
 * объявив нужную константу локально в самой странице.
 */

const appRoutes = `export const HOME_ROUTE = '/'
`

const homePageStart = `import { HOME_ROUTE } from '@/app/config/routes'

// TODO: страница не должна знать про app. Уберите импорт из app —
// объявите HOME_ROUTE локальной константой прямо в этом файле.
export function HomePage() {
  return <div className="home-page">Главная ({HOME_ROUTE})</div>
}
`

const homePageSolution = `const HOME_ROUTE = '/'

export function HomePage() {
  return <div className="home-page">Главная ({HOME_ROUTE})</div>
}
`

const pagesHomeIndex = `export { HomePage } from './ui/HomePage'
`

const roFiles = [
  { path: 'src/app/config/routes.ts', content: appRoutes, role: 'readonly' as const },
  { path: 'src/pages/home/index.ts', content: pagesHomeIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '8.4',
  title: 'Задание 8.4 — Ничто не импортирует app (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/pages/home/ui/HomePage.tsx', content: homePageStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/pages/home/ui/HomePage.tsx', content: homePageSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    fileContains(
      'src/pages/home/ui/HomePage.tsx',
      /const\s+HOME_ROUTE\s*=\s*'\/'/,
      'HomePage объявляет HOME_ROUTE локально, а не тянет её из app'
    ),
  ],
}
