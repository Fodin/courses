import { noRuntimeCycles, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 7.4 (простое) — Разрыв цикла динамическим import().
 *
 * Дано: app.ts и feature.ts статически импортируют друг друга — рантайм-цикл
 * на двух файлах. Задача: feature.ts откладывает импорт app.ts до момента
 * вызова через `await import('./app')` — статическое ребро исчезает.
 */

const appStart = `import { runFeature } from './feature'

export function init(): void {
  console.log('init app')
}

export function triggerFeature(): void {
  runFeature()
}
`

const featureStart = `import { init } from './app'

// TODO: замените статический импорт init на динамический import('./app')
// прямо внутри функции — тогда ребро исчезнет из графа импортов.
export function runFeature(): void {
  init()
  console.log('feature executed')
}
`

const featureSolution = `export async function runFeature(): Promise<void> {
  const { init } = await import('./app')
  init()
  console.log('feature executed')
}
`

export const spec: LabSpec = {
  id: '7.4',
  title: 'Задание 7.4 — Разрыв цикла динамическим import() (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/app.ts', content: appStart, role: 'readonly' },
    { path: 'src/feature.ts', content: featureStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/app.ts', content: appStart, role: 'readonly' },
    { path: 'src/feature.ts', content: featureSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/feature.ts',
      /await import\(['"]\.\/app['"]\)/,
      '`feature.ts` загружает app.ts динамическим `import()` внутри функции'
    ),
  ],
}
