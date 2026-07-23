import { fileContains, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 4.3 (сложное) — большой barrel: внутренние импорты чинить, внешний
 * публичный API не трогать.
 *
 * Пакет `src/pkg` (`a.ts`, `b.ts`, `c.ts`) со своим barrel `pkg/index.ts`.
 * `a.ts` и `c.ts` по ошибке берут значение соседа через `./index` (замыкают
 * цикл сами на себя), а `b.ts` уже импортирует правильно — трогать не нужно.
 * Снаружи пакета `consumer.ts` легитимно импортирует из `'./pkg'` (это и есть
 * назначение barrel — единая точка входа для внешних потребителей), этот файл
 * менять НЕЛЬЗЯ и незачем: цикла он не создаёт.
 */

const pkgIndexContent = `import { aValue } from './a'
import { bValue } from './b'
import { cValue } from './c'

export { aValue, bValue, cValue }
`

const pkgBContent = `export const bValue = 'b'
`

const pkgAStart = `import { bValue } from './index' // TODO: импортируй bValue напрямую из './b', а не через barrel

export const aValue = 'a:' + bValue
`

const pkgASolution = `import { bValue } from './b'

export const aValue = 'a:' + bValue
`

const pkgCStart = `import { bValue } from './index' // TODO: импортируй bValue напрямую из './b', а не через barrel

export const cValue = 'c:' + bValue
`

const pkgCSolution = `import { bValue } from './b'

export const cValue = 'c:' + bValue
`

const consumerContent = `import { aValue, cValue } from './pkg' // легитимный внешний импорт через public API — не трогать

export const summary = aValue + '/' + cValue
`

export const spec: LabSpec = {
  id: '4.3',
  title: 'Задание 4.3 — Большой barrel: чиним только внутренние импорты (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/pkg/index.ts', content: pkgIndexContent, role: 'readonly' },
    { path: 'src/pkg/a.ts', content: pkgAStart, role: 'editable' },
    { path: 'src/pkg/b.ts', content: pkgBContent, role: 'readonly' },
    { path: 'src/pkg/c.ts', content: pkgCStart, role: 'editable' },
    { path: 'src/consumer.ts', content: consumerContent, role: 'readonly' },
  ],
  solution: [
    { path: 'src/pkg/index.ts', content: pkgIndexContent, role: 'readonly' },
    { path: 'src/pkg/a.ts', content: pkgASolution, role: 'editable' },
    { path: 'src/pkg/b.ts', content: pkgBContent, role: 'readonly' },
    { path: 'src/pkg/c.ts', content: pkgCSolution, role: 'editable' },
    { path: 'src/consumer.ts', content: consumerContent, role: 'readonly' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains('src/pkg/a.ts', /from\s*'\.\/b'/, "pkg/a.ts импортирует bValue напрямую из './b'"),
    fileContains('src/pkg/c.ts', /from\s*'\.\/b'/, "pkg/c.ts импортирует bValue напрямую из './b'"),
  ],
}
