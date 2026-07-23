/**
 * Снимок песочницы: над ним работают все проверки.
 *
 * Строится из текущего содержимого редактируемых + readonly + hidden файлов.
 * Импорты парсятся лениво и кэшируются.
 */
import { extractImports } from './parse'
import { resolveImport } from './resolve'
import { FSD_LAYERS, type FsdLayer, type ImportEdge, type VirtualFs } from './types'

const DEFAULT_ALIASES: Record<string, string> = { '@': 'src' }

/** Слой файла по пути: сегмент сразу после 'src/'. */
export function layerOf(path: string): FsdLayer | null {
  const m = path.match(/(?:^|\/)src\/([^/]+)/)
  if (!m) return null
  const seg = m[1]
  return (FSD_LAYERS as readonly string[]).includes(seg) ? (seg as FsdLayer) : null
}

/** Слайс файла: сегмент после слоя (`src/<layer>/<slice>/...`). */
export function sliceOf(path: string): string | null {
  const m = path.match(/(?:^|\/)src\/([^/]+)\/([^/]+)/)
  if (!m) return null
  if (!(FSD_LAYERS as readonly string[]).includes(m[1])) return null
  // shared обычно не делится на слайсы — сегмент трактуем как «сегмент», не слайс.
  return m[2]
}

export function rank(layer: FsdLayer): number {
  return FSD_LAYERS.indexOf(layer)
}

export function createVirtualFs(
  files: Record<string, string>,
  aliases: Record<string, string> = DEFAULT_ALIASES
): VirtualFs {
  const importCache = new Map<string, ImportEdge[]>()
  const exists = (p: string) => Object.prototype.hasOwnProperty.call(files, p)

  const fs: VirtualFs = {
    files,
    read: p => (exists(p) ? files[p] : undefined),
    exists,
    list: prefix => Object.keys(files).filter(p => !prefix || p.startsWith(prefix)),
    layerOf,
    sliceOf,
    resolve: (fromPath, specifier) => resolveImport(specifier, fromPath, aliases, exists),
    imports(path) {
      if (importCache.has(path)) return importCache.get(path)!
      const code = files[path]
      const edges: ImportEdge[] = code
        ? extractImports(code).map(raw => ({
            source: raw.source,
            resolved: resolveImport(raw.source, path, aliases, exists),
            named: raw.named,
            isTypeOnly: raw.isTypeOnly,
          }))
        : []
      importCache.set(path, edges)
      return edges
    },
  }

  return fs
}
