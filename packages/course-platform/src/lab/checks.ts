/**
 * Библиотека проверок для многофайловых заданий. Автор задания только
 * композирует их в `spec.checks`. Каждая фабрика возвращает `Check` — чистую
 * функцию над снимком песочницы.
 *
 * Блок «Циклы» — ядро курса про циклические зависимости. Блок «FSD» — для
 * уровней про архитектурные границы (слои/слайсы), где цикл рождается из
 * нарушения направления импортов.
 */
import { extractExports } from './parse'
import { rank } from './vfs'
import type { Check, CheckResult, VirtualFs } from './types'

const ok = (message: string): CheckResult => ({ passed: true, message })
const fail = (message: string, hint?: string): CheckResult => ({ passed: false, message, hint })

/** Файл существует в песочнице. */
export function fileExists(path: string): Check {
  return fs => (fs.exists(path) ? ok(`Файл \`${path}\` создан`) : fail(`Нет файла \`${path}\``))
}

/** Содержимое файла соответствует регулярному выражению. */
export function fileContains(path: string, re: RegExp, label?: string): Check {
  return fs => {
    const code = fs.read(path)
    if (code === undefined) return fail(`Нет файла \`${path}\``)
    return re.test(code)
      ? ok(label ?? `\`${path}\` содержит нужный фрагмент`)
      : fail(label ?? `\`${path}\` не содержит ожидаемый фрагмент`, `Проверьте паттерн: ${re}`)
  }
}

/**
 * Символ `name` доступен через public API (index), в т.ч. через реэкспорты.
 * `reexportFrom` — путь сегмента, где символ объявлен (для точной подсказки).
 */
export function exportsFromPublicApi(
  indexPath: string,
  name: string,
  reexportFrom?: string
): Check {
  return fs => {
    if (!fs.exists(indexPath)) return fail(`Нет public API \`${indexPath}\``)
    if (exportReachable(fs, indexPath, name, new Set())) {
      return ok(`\`${name}\` экспортируется из \`${indexPath}\``)
    }
    const hint = reexportFrom
      ? `Реэкспортируйте его в index.ts из сегмента, где он объявлен, напр. ` +
        `\`export { ${name} } from '${reexportFrom}'\``
      : `Реэкспортируйте \`${name}\` в index.ts из сегмента, где он объявлен`
    return fail(`\`${name}\` не виден из \`${indexPath}\``, hint)
  }
}

function exportReachable(fs: VirtualFs, path: string, name: string, seen: Set<string>): boolean {
  if (seen.has(path)) return false
  seen.add(path)
  const code = fs.read(path)
  if (code === undefined) return false
  const ex = extractExports(code)
  if (ex.names.includes(name)) return true
  for (const src of ex.reexportSources) {
    const resolved = fs.resolve(path, src)
    if (resolved && exportReachable(fs, resolved, name, seen)) return true
  }
  return false
}

/** В слайсе присутствуют указанные сегменты (по хотя бы одному файлу в каждом). */
export function sliceHasSegments(sliceDir: string, segments: string[]): Check {
  const base = sliceDir.replace(/\/+$/, '')
  return fs => {
    const missing = segments.filter(seg => fs.list(`${base}/${seg}/`).length === 0)
    return missing.length === 0
      ? ok(`Слайс \`${base}\` содержит сегменты: ${segments.join(', ')}`)
      : fail(`В \`${base}\` не хватает сегментов: ${missing.join(', ')}`)
  }
}

/**
 * Чужой слайс импортируется только через его public API (index), а не вглубь
 * сегментов. Импорты внутри своего слайса и импорты shared/app — разрешены.
 */
export function noDeepImport(): Check {
  return fs => {
    for (const file of fs.list()) {
      const fromLayer = fs.layerOf(file)
      const fromSlice = fs.sliceOf(file)
      for (const edge of fs.imports(file)) {
        if (!edge.resolved) continue
        const toLayer = fs.layerOf(edge.resolved)
        const toSlice = fs.sliceOf(edge.resolved)
        if (!toLayer || toLayer === 'shared' || toLayer === 'app') continue
        if (!toSlice) continue
        // внутри своего же слайса — можно как угодно
        if (toLayer === fromLayer && toSlice === fromSlice) continue
        const remainder = afterSlice(edge.resolved, toLayer, toSlice)
        const isPublicApi = remainder === 'index.ts' || remainder === 'index.tsx'
        if (!isPublicApi) {
          return fail(
            `Глубокий импорт: \`${file}\` тянет \`${edge.source}\` в обход public API`,
            `Импортируйте из \`src/${toLayer}/${toSlice}\` (его index.ts), а не из внутренних сегментов`
          )
        }
      }
    }
    return ok('Все импорты чужих слайсов идут через public API')
  }
}

function afterSlice(path: string, layer: string, slice: string): string | null {
  const m = path.match(new RegExp(`(?:^|/)src/${escape(layer)}/${escape(slice)}/(.+)$`))
  return m ? m[1] : null
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Импорты уважают направление слоёв: нельзя импортировать «вверх» (в вышестоящий
 * слой) и нельзя cross-import между слайсами одного слоя (кроме shared).
 */
export function importsRespectLayers(): Check {
  return fs => {
    for (const file of fs.list()) {
      const fromLayer = fs.layerOf(file)
      if (!fromLayer) continue
      const fromSlice = fs.sliceOf(file)
      for (const edge of fs.imports(file)) {
        if (!edge.resolved) continue
        const toLayer = fs.layerOf(edge.resolved)
        if (!toLayer) continue
        if (rank(toLayer) < rank(fromLayer)) {
          return fail(
            `Импорт вверх: \`${file}\` (${fromLayer}) импортирует из слоя ${toLayer}`,
            'Слои импортируют только вниз: app → pages → widgets → features → entities → shared'
          )
        }
        if (toLayer === fromLayer && toLayer !== 'shared') {
          const toSlice = fs.sliceOf(edge.resolved)
          if (fromSlice && toSlice && fromSlice !== toSlice) {
            return fail(
              `Cross-import: \`${file}\` импортирует соседний слайс \`${toSlice}\` того же слоя`,
              'Слайсы одного слоя не знают друг о друге. Поднимите композицию на слой выше или используйте @x-нотацию'
            )
          }
        }
      }
    }
    return ok('Импорты уважают слои и изоляцию слайсов')
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Циклы — ядро курса
// ─────────────────────────────────────────────────────────────────────────────

/** Короткое имя файла для сообщений: убираем ведущий `src/`. */
function short(path: string): string {
  return path.replace(/^src\//, '')
}

/**
 * Поиск цикла в графе импортов песочницы (DFS с восстановлением пути).
 * `includeTypeOnly=false` — рёбра только для значений: `import type` исключается,
 * т.к. стирается при компиляции и рантайм-цикла не создаёт. Внешние (не
 * резолвящиеся) импорты не считаются рёбрами. Возвращает цепочку узлов цикла
 * (первый узел повторён в конце) либо null.
 */
function findCycle(fs: VirtualFs, includeTypeOnly: boolean): string[] | null {
  const nodes = fs.list()
  const inNodes = new Set(nodes)
  const adj = (p: string): string[] =>
    fs
      .imports(p)
      .filter(e => e.resolved && inNodes.has(e.resolved) && (includeTypeOnly || !e.isTypeOnly))
      .map(e => e.resolved as string)

  const WHITE = 0
  const GREY = 1
  const BLACK = 2
  const color = new Map<string, number>(nodes.map(n => [n, WHITE]))
  const stack: string[] = []

  function dfs(node: string): string[] | null {
    color.set(node, GREY)
    stack.push(node)
    for (const next of adj(node)) {
      if (color.get(next) === GREY) {
        // назад-ребро: цикл от next до текущей вершины
        const from = stack.indexOf(next)
        return [...stack.slice(from), next]
      }
      if (color.get(next) === WHITE) {
        const found = dfs(next)
        if (found) return found
      }
    }
    stack.pop()
    color.set(node, BLACK)
    return null
  }

  for (const node of nodes) {
    if (color.get(node) === WHITE) {
      const cycle = dfs(node)
      if (cycle) return cycle
    }
  }
  return null
}

/**
 * В графе рантайм-импортов НЕТ циклов. Учитываются только рёбра-значения:
 * `import type { ... }` НЕ создаёт ребра (стирается компилятором). Это ключевая
 * проверка курса — она «зелёная», когда цикл разорван любым корректным приёмом
 * (тип вынесен в `import type`, зависимость инвертирована, общее вынесено в
 * третий модуль, использован динамический импорт и т.п.).
 */
export function noRuntimeCycles(): Check {
  return fs => {
    const cycle = findCycle(fs, false)
    if (!cycle) return ok('В графе рантайм-импортов нет циклов')
    return fail(
      `Найден цикл импортов: ${cycle.map(short).join(' → ')}`,
      'Разорвите цикл: import type для типов, инверсия зависимости (DIP), вынос общего в третий модуль или динамический import()'
    )
  }
}

/**
 * В графе НЕТ циклов даже с учётом type-only импортов. Строже, чем
 * `noRuntimeCycles`: полезно, когда цикл нужно устранить структурно, а не просто
 * пометить рёбра типами.
 */
export function noCyclesIncludingTypes(): Check {
  return fs => {
    const cycle = findCycle(fs, true)
    if (!cycle) return ok('В графе импортов нет циклов (включая типовые)')
    return fail(
      `Найден цикл импортов: ${cycle.map(short).join(' → ')}`,
      'Устраните цикл структурно: разнесите объявления так, чтобы граф стал ациклическим'
    )
  }
}

/**
 * Импорт из `fromPath`, чей specifier матчит `sourceMatch`, должен быть
 * type-only (`import type ...`). Провал, если такого импорта нет или он рантайм.
 * Для заданий, где корректный приём — именно пометить импорт как типовой.
 */
export function importIsTypeOnly(fromPath: string, sourceMatch: RegExp, label?: string): Check {
  return fs => {
    if (!fs.exists(fromPath)) return fail(`Нет файла \`${short(fromPath)}\``)
    const edges = fs.imports(fromPath).filter(e => sourceMatch.test(e.source))
    if (edges.length === 0) {
      return fail(
        label ?? `В \`${short(fromPath)}\` нет импорта, соответствующего ${sourceMatch}`
      )
    }
    const runtime = edges.find(e => !e.isTypeOnly)
    return runtime
      ? fail(
          label ?? `Импорт \`${runtime.source}\` в \`${short(fromPath)}\` всё ещё рантайм`,
          `Сделайте его типовым: \`import type { ... } from '${runtime.source}'\``
        )
      : ok(label ?? `Импорт из \`${short(fromPath)}\` помечен как типовой`)
  }
}
