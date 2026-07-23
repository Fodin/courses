/**
 * Резолв import-specifier в путь внутри песочницы.
 *
 * Поддерживает:
 * - относительные './', '../';
 * - алиасы вида { '@': 'src' } → '@/entities/x' -> 'src/entities/x';
 * - подстановку расширений и '/index'.
 * Внешние импорты (react и т.п.) → null.
 */

const EXTENSIONS = ['', '.ts', '.tsx', '.css', '.json', '.md', '/index.ts', '/index.tsx']

/** Нормализовать путь: убрать '.', разрешить '..'. */
export function normalizePath(p: string): string {
  const isAbs = p.startsWith('/')
  const parts = p.split('/')
  const stack: string[] = []
  for (const part of parts) {
    if (part === '' || part === '.') continue
    if (part === '..') {
      if (stack.length && stack[stack.length - 1] !== '..') stack.pop()
      else if (!isAbs) stack.push('..')
    } else {
      stack.push(part)
    }
  }
  return (isAbs ? '/' : '') + stack.join('/')
}

function dirname(p: string): string {
  const idx = p.lastIndexOf('/')
  return idx === -1 ? '' : p.slice(0, idx)
}

/**
 * Разрешить specifier относительно fromPath.
 * @param exists — предикат существования файла в песочнице.
 * @returns путь файла в песочнице или null (внешний / не найден).
 */
export function resolveImport(
  specifier: string,
  fromPath: string,
  aliases: Record<string, string>,
  exists: (path: string) => boolean
): string | null {
  let base: string | null = null

  if (specifier.startsWith('.')) {
    base = normalizePath(dirname(fromPath) + '/' + specifier)
  } else {
    // Алиасы: точное совпадение ключа как первого сегмента
    for (const [key, target] of Object.entries(aliases)) {
      if (specifier === key) {
        base = normalizePath(target)
        break
      }
      if (specifier.startsWith(key + '/')) {
        base = normalizePath(target + '/' + specifier.slice(key.length + 1))
        break
      }
    }
  }

  if (base === null) return null // внешний пакет

  // Кандидат «как есть» уже с расширением?
  for (const ext of EXTENSIONS) {
    const candidate = base + ext
    if (exists(candidate)) return candidate
  }
  return null
}
