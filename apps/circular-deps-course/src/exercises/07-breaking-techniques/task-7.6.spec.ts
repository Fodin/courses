import { noRuntimeCycles, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 7.6 (сложное) — Динамический import() применяется дважды.
 *
 * Дано: два независимых двусторонних цикла — reports.ts ↔ exporter.ts и
 * search.ts ↔ indexer.ts. В обоих случаях «обратный» вызов нужен редко,
 * внутри одной вспомогательной функции. Задача: в обоих модулях заменить
 * статический обратный импорт на `await import(...)` внутри функции.
 */

const reportsStart = `import { exportReport } from './exporter'

export function generateReport(id: string): string {
  const report = \`report:\${id}\`
  exportReport(report)
  return report
}
`

const exporterStart = `import { generateReport } from './reports'

export function exportReport(report: string): void {
  console.log('exporting', report)
}

// TODO: reExportLatest вызывает generateReport обратно из reports.ts —
// замените статический импорт на динамический import('./reports') внутри функции.
export function reExportLatest(id: string) {
  return exportReport(generateReport(id))
}
`

const exporterSolution = `export function exportReport(report: string): void {
  console.log('exporting', report)
}

export async function reExportLatest(id: string) {
  const { generateReport } = await import('./reports')
  return exportReport(generateReport(id))
}
`

const searchStart = `import { rebuildIndex } from './indexer'

export function search(query: string): string[] {
  console.log('searching', query)
  return []
}

export function refreshAndSearch(query: string) {
  rebuildIndex()
  return search(query)
}
`

const indexerStart = `import { search } from './search'

export function rebuildIndex(): void {
  console.log('rebuilding index')
}

// TODO: verifyIndex вызывает search обратно из search.ts —
// замените статический импорт на динамический import('./search') внутри функции.
export function verifyIndex(query: string) {
  return search(query)
}
`

const indexerSolution = `export function rebuildIndex(): void {
  console.log('rebuilding index')
}

export async function verifyIndex(query: string) {
  const { search } = await import('./search')
  return search(query)
}
`

export const spec: LabSpec = {
  id: '7.6',
  title: 'Задание 7.6 — Динамический import() применяется дважды (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/reports.ts', content: reportsStart, role: 'readonly' },
    { path: 'src/exporter.ts', content: exporterStart, role: 'editable' },
    { path: 'src/search.ts', content: searchStart, role: 'readonly' },
    { path: 'src/indexer.ts', content: indexerStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/reports.ts', content: reportsStart, role: 'readonly' },
    { path: 'src/exporter.ts', content: exporterSolution, role: 'editable' },
    { path: 'src/search.ts', content: searchStart, role: 'readonly' },
    { path: 'src/indexer.ts', content: indexerSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/exporter.ts',
      /await import\(['"]\.\/reports['"]\)/,
      '`exporter.ts` загружает reports.ts динамическим `import()` внутри функции'
    ),
    fileContains(
      'src/indexer.ts',
      /await import\(['"]\.\/search['"]\)/,
      '`indexer.ts` загружает search.ts динамическим `import()` внутри функции'
    ),
  ],
}
