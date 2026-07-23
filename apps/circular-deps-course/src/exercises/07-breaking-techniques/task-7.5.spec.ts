import { noRuntimeCycles, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 7.5 (среднее) — Динамический import() в цепочке из трёх модулей.
 *
 * Дано: start.ts → step-b.ts → step-c.ts → start.ts — цикл длиной 3.
 * Задача: разорвать его, заменив в step-c.ts статический импорт start.ts на
 * `await import('./start')` внутри функции.
 */

const startStart = `import { stepB } from './step-b'

export function start(): void {
  console.log('start')
  stepB()
}

export function finish(): void {
  console.log('finished')
}
`

const stepBStart = `import { stepC } from './step-c'

export function stepB(): void {
  console.log('step b')
  stepC()
}
`

const stepCStart = `import { finish } from './start'

// TODO: замените статический импорт finish на динамический import('./start')
// прямо внутри stepC — тогда ребро step-c.ts → start.ts исчезнет из графа.
export function stepC(): void {
  console.log('step c')
  finish()
}
`

const stepCSolution = `export async function stepC(): Promise<void> {
  console.log('step c')
  const { finish } = await import('./start')
  finish()
}
`

export const spec: LabSpec = {
  id: '7.5',
  title: 'Задание 7.5 — Динамический import() в цепочке из трёх модулей (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/start.ts', content: startStart, role: 'readonly' },
    { path: 'src/step-b.ts', content: stepBStart, role: 'readonly' },
    { path: 'src/step-c.ts', content: stepCStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/start.ts', content: startStart, role: 'readonly' },
    { path: 'src/step-b.ts', content: stepBStart, role: 'readonly' },
    { path: 'src/step-c.ts', content: stepCSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/step-c.ts',
      /await import\(['"]\.\/start['"]\)/,
      '`step-c.ts` загружает start.ts динамическим `import()` внутри функции'
    ),
  ],
}
