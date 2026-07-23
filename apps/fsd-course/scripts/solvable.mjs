/**
 * Проверка РЕШАЕМОСТИ LAB-заданий в реальном UI.
 * FsdLab/useSandbox не даёт создавать новые файлы — ученик правит только те, что
 * есть в spec.files. Значит каждый путь из spec.solution ОБЯЗАН присутствовать в
 * spec.files (иначе цель недостижима в редакторе). Дополнительно: путь, который
 * нужно менять, не должен быть role:'readonly'.
 *
 * Использование: node scripts/solvable.mjs src/exercises/NN-slug [...ещё папки]
 */
import { build } from 'vite'
import { readdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { tmpdir } from 'node:os'

const folders = process.argv.slice(2)
if (folders.length === 0) {
  console.error('Usage: node scripts/solvable.mjs <level-folder> [...]')
  process.exit(1)
}

const srcRoot = resolve('src')
const headless = resolve('scripts/engine-headless.ts')
let totalBad = 0

for (const folder of folders) {
  const abs = resolve(folder)
  const specFiles = readdirSync(abs)
    .filter(f => /^task-.*\.spec\.ts$/.test(f))
    .sort()
  if (specFiles.length === 0) continue

  const imports = specFiles
    .map((f, i) => `import { spec as s${i} } from ${JSON.stringify(join(abs, f))}`)
    .join('\n')
  const list = specFiles.map((_, i) => `s${i}`).join(', ')

  const entrySrc = `
${imports}
const specs = [${list}]
let bad = 0
for (const spec of specs) {
  const startPaths = new Map(spec.files.map(f => [f.path, f.role || 'editable']))
  for (const sf of spec.solution) {
    if (!startPaths.has(sf.path)) {
      bad++; console.log('  x ' + spec.id + ': путь эталона ОТСУТСТВУЕТ в старте (ученик не создаст): ' + sf.path)
      continue
    }
    const role = startPaths.get(sf.path)
    const changed = sf.content !== (spec.files.find(f => f.path === sf.path)?.content)
    if (changed && role === 'readonly') {
      bad++; console.log('  x ' + spec.id + ': файл надо менять, но он role:readonly: ' + sf.path)
    }
  }
}
if (bad === 0) console.log('  ok ${folder}: все пути эталона доступны в старте')
globalThis.__bad = bad
`

  const tmp = mkdtempSync(join(tmpdir(), 'fsd-solv-'))
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
  totalBad += globalThis.__bad || 0
}

console.log(totalBad === 0 ? '\nРЕШАЕМОСТЬ OK' : `\nПРОБЛЕМЫ РЕШАЕМОСТИ (${totalBad})`)
process.exit(totalBad === 0 ? 0 : 1)
