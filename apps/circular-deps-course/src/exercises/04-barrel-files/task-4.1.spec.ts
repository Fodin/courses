import { fileContains, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 4.1 (простое) — self-import цикл через собственный barrel.
 *
 * `index.ts` — barrel пакета, реэкспортирует `a.ts` и `b.ts`. Модуль `a.ts`
 * вместо того, чтобы взять `bValue` напрямую у соседа, тянет его через
 * собственный же barrel (`from './index'`). А barrel, в свою очередь,
 * реэкспортирует `a.ts` — получается цикл `a → index → a`.
 */

const indexStart = `import { aValue } from './a'
import { bValue } from './b'

export { aValue, bValue }
`

const aStart = `import { bValue } from './index' // TODO: импортируй bValue напрямую из './b', а не через barrel

export const aValue = 'a:' + bValue
`

const aSolution = `import { bValue } from './b'

export const aValue = 'a:' + bValue
`

const bContent = `export const bValue = 'b'
`

export const spec: LabSpec = {
  id: '4.1',
  title: 'Задание 4.1 — Self-import цикл через собственный barrel (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/index.ts', content: indexStart, role: 'readonly' },
    { path: 'src/a.ts', content: aStart, role: 'editable' },
    { path: 'src/b.ts', content: bContent, role: 'readonly' },
  ],
  solution: [
    { path: 'src/index.ts', content: indexStart, role: 'readonly' },
    { path: 'src/a.ts', content: aSolution, role: 'editable' },
    { path: 'src/b.ts', content: bContent, role: 'readonly' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/a.ts',
      /from\s*'\.\/b'/,
      "a.ts импортирует bValue напрямую из './b', минуя barrel"
    ),
  ],
}
