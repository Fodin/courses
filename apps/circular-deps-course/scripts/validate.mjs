/**
 * Универсальный валидатор LAB-уровней fsd-course.
 * Использование:
 *   node scripts/validate.mjs src/exercises/09-slices-public-api
 * Для каждого task-*.spec.ts проверяет:
 *   - START (spec.files):      минимум одна проверка ПРОВАЛЕНА (иначе задание уже решено);
 *   - SOLUTION (spec.solution): все проверки ПРОЙДЕНЫ (иначе эталон неверный).
 * Бандлит через Vite (alias src → src/), движок берётся «безголовым» шимом (без React).
 */
import { build } from 'vite'
import { readdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { tmpdir } from 'node:os'

const folder = process.argv[2]
if (!folder) {
  console.error('Usage: node scripts/validate.mjs <level-folder>')
  process.exit(1)
}

const abs = resolve(folder)
const srcRoot = resolve('src')
const headless = resolve('scripts/engine-headless.ts')
const specFiles = readdirSync(abs)
  .filter(f => /^task-.*\.spec\.ts$/.test(f))
  .sort()

if (specFiles.length === 0) {
  console.error(`Нет task-*.spec.ts в ${folder}`)
  process.exit(1)
}

const imports = specFiles
  .map((f, i) => `import { spec as s${i} } from ${JSON.stringify(join(abs, f))}`)
  .join('\n')
const list = specFiles.map((_, i) => `s${i}`).join(', ')

const entrySrc = `
import { createVirtualFs } from 'src/engine'
${imports}
const specs = [${list}]
const toRecord = files => Object.fromEntries(files.map(f => [f.path, f.content]))
let bad = 0
for (const spec of specs) {
  const start = createVirtualFs(toRecord(spec.files), spec.aliases)
  const startRes = spec.checks.map(c => c(start))
  const solved = createVirtualFs(toRecord(spec.solution), spec.aliases)
  const solvedRes = spec.checks.map(c => c(solved))
  const startFails = startRes.filter(r => !r.passed).length
  const solvedFails = solvedRes.filter(r => !r.passed)
  const line = spec.id + ': START провалов=' + startFails + '/' + spec.checks.length +
             ', SOLUTION провалов=' + solvedFails.length + '/' + spec.checks.length
  const problems = []
  if (startFails === 0) problems.push('START без провалов — задание уже решено!')
  if (solvedFails.length > 0) problems.push('SOLUTION не проходит: ' + solvedFails.map(r => r.message).join(' | '))
  if (problems.length) { bad++; console.log('  x ' + line); problems.forEach(p => console.log('     - ' + p)) }
  else console.log('  ok ' + line)
}
console.log(bad === 0 ? '\\nВСЕ ЗАДАНИЯ КОРРЕКТНЫ' : '\\nЕСТЬ ПРОБЛЕМЫ (' + bad + ')')
process.exit(bad === 0 ? 0 : 1)
`

const tmp = mkdtempSync(join(tmpdir(), 'fsd-val-'))
const entryFile = join(tmp, 'entry.ts')
writeFileSync(entryFile, entrySrc)

await build({
  configFile: false,
  logLevel: 'error',
  resolve: {
    alias: [
      { find: /^src\/engine$/, replacement: headless },
      { find: /^src$/, replacement: srcRoot },
      { find: /^src\//, replacement: srcRoot + '/' },
    ],
  },
  build: {
    ssr: entryFile,
    outDir: tmp,
    write: true,
    minify: false,
    target: 'node22',
    rollupOptions: { output: { format: 'es', entryFileNames: 'v.mjs' } },
  },
})

await import(pathToFileURL(join(tmp, 'v.mjs')).href)
