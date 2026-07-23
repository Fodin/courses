import { fileContains, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 9.1 (простое) — Барель собственного слайса замыкает цикл.
 *
 * Внутри одного слайса `entities/user` сегмент `model/greet.ts` вместо прямого
 * импорта соседа `model/name.ts` тянет его через СВОЙ ЖЕ public API — `../index`.
 * А `index.ts` реэкспортирует сам `greet.ts`. Получается цикл длиной 2:
 * `greet.ts → index.ts → greet.ts`, хотя оба файла лежат в одном слайсе.
 */

const nameFile = `export function formatName(value: string): string {
  return value.trim()
}
`

const greetStart = `import { formatName } from '../index' // TODO: слайс сам себе не нужен — импортируйте соседа напрямую

export function greet(value: string): string {
  return 'Hi, ' + formatName(value)
}
`

const greetSolution = `import { formatName } from './name'

export function greet(value: string): string {
  return 'Hi, ' + formatName(value)
}
`

// Барель написан двустрочно (import + export), а не однострочным
// \`export { x } from './y'\` — так реэкспорт реально создаёт ребро в графе
// импортов, и цикл через барель по-настоящему детектируется.
const indexFile = `import { formatName } from './model/name'
import { greet } from './model/greet'

export { formatName, greet }
`

export const spec: LabSpec = {
  id: '9.1',
  title: 'Задание 9.1 — Барель своего слайса замыкает цикл (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/user/model/name.ts', content: nameFile, role: 'readonly' },
    { path: 'src/entities/user/model/greet.ts', content: greetStart, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: indexFile, role: 'readonly' },
  ],
  solution: [
    { path: 'src/entities/user/model/name.ts', content: nameFile, role: 'readonly' },
    { path: 'src/entities/user/model/greet.ts', content: greetSolution, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: indexFile, role: 'readonly' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/entities/user/model/greet.ts',
      /from\s*'\.\/name'/,
      'greet.ts импортирует name.ts напрямую, а не через собственный index.ts'
    ),
  ],
}
