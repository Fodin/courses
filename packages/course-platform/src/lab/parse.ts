/**
 * Лёгкий извлекатель импортов/экспортов для учебного кода.
 *
 * Полноценный AST-парсер здесь избыточен: контент контролирует автор задания,
 * форматирование предсказуемо. Чтобы regex не срабатывал на import/export внутри
 * комментариев, сначала вырезаем комментарии (строки при этом сохраняются — они
 * несут specifier импорта).
 */

/**
 * Вырезать комментарии, заменяя их пробелами (позиции не сдвигаются).
 * Строковые и шаблонные литералы СОХРАНЯЮТСЯ — они нужны для import/export
 * specifier'ов, — но обрабатываются с учётом границ, чтобы `//` внутри строки
 * (напр. 'http://x') не принимался за начало комментария.
 */
export function stripComments(code: string): string {
  let out = ''
  let i = 0
  const n = code.length
  while (i < n) {
    const c = code[i]
    const next = code[i + 1]

    // Строчный комментарий
    if (c === '/' && next === '/') {
      while (i < n && code[i] !== '\n') {
        out += ' '
        i++
      }
      continue
    }
    // Блочный комментарий
    if (c === '/' && next === '*') {
      out += '  '
      i += 2
      while (i < n && !(code[i] === '*' && code[i + 1] === '/')) {
        out += code[i] === '\n' ? '\n' : ' '
        i++
      }
      out += '  '
      i += 2
      continue
    }
    // Строковые и шаблонные литералы — копируем как есть, но проскакиваем целиком
    if (c === '"' || c === "'" || c === '`') {
      const quote = c
      out += c
      i++
      while (i < n) {
        if (code[i] === '\\') {
          out += code[i] + (code[i + 1] ?? '')
          i += 2
          continue
        }
        out += code[i]
        if (code[i] === quote) {
          i++
          break
        }
        i++
      }
      continue
    }
    out += c
    i++
  }
  return out
}

export interface RawImport {
  source: string
  named: string[]
  isTypeOnly: boolean
}

const IMPORT_FROM_RE = /import\s+(type\s+)?([\s\S]*?)\s+from\s*['"]([^'"]+)['"]/g
const IMPORT_SIDE_EFFECT_RE = /import\s*['"]([^'"]+)['"]/g

/** Извлечь все импорты из исходника файла. */
export function extractImports(code: string): RawImport[] {
  const src = stripComments(code)
  const result: RawImport[] = []

  IMPORT_FROM_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = IMPORT_FROM_RE.exec(src)) !== null) {
    const typeOnlyStmt = Boolean(m[1])
    const clause = m[2]
    const source = m[3]
    const named: string[] = []
    let namedTypeOnly = false

    const braced = clause.match(/\{([\s\S]*?)\}/)
    if (braced) {
      for (const part of braced[1].split(',')) {
        const token = part.trim()
        if (!token) continue
        // `type Foo` / `Foo as Bar` — берём исходное имя
        const cleaned = token.replace(/^type\s+/, '')
        const name = cleaned.split(/\s+as\s+/)[0].trim()
        if (name) named.push(name)
      }
      // весь клоз вида { type A } не помечаем целиком, но если единственный тип —
      // это всё же значение по умолчанию считаем не type-only на уровне стейтмента
      namedTypeOnly = false
    }

    result.push({ source, named, isTypeOnly: typeOnlyStmt || namedTypeOnly })
  }

  // Side-effect импорты: import 'x'
  IMPORT_SIDE_EFFECT_RE.lastIndex = 0
  while ((m = IMPORT_SIDE_EFFECT_RE.exec(src)) !== null) {
    const source = m[1]
    // не дублируем то, что уже поймано с `from`
    if (!result.some(r => r.source === source)) {
      result.push({ source, named: [], isTypeOnly: false })
    }
  }

  return result
}

export interface RawExports {
  /** Имена, объявленные/реэкспортированные напрямую. */
  names: string[]
  /** Источники `export * from './x'` и `export { ... } from './x'`. */
  reexportSources: string[]
  hasDefault: boolean
}

const EXPORT_DECL_RE = /export\s+(?:default\s+)?(?:const|let|var|function\*?|class|type|interface|enum)\s+([A-Za-z_$][\w$]*)/g
const EXPORT_NAMED_RE = /export\s+(?:type\s+)?\{([^}]*)\}(?:\s*from\s*['"]([^'"]+)['"])?/g
const EXPORT_STAR_RE = /export\s*\*(?:\s*as\s+([A-Za-z_$][\w$]*))?\s*from\s*['"]([^'"]+)['"]/g
const EXPORT_DEFAULT_RE = /export\s+default\b/

/** Извлечь экспорты из исходника файла. */
export function extractExports(code: string): RawExports {
  const src = stripComments(code)
  const names: string[] = []
  const reexportSources: string[] = []

  let m: RegExpExecArray | null

  EXPORT_DECL_RE.lastIndex = 0
  while ((m = EXPORT_DECL_RE.exec(src)) !== null) names.push(m[1])

  EXPORT_NAMED_RE.lastIndex = 0
  while ((m = EXPORT_NAMED_RE.exec(src)) !== null) {
    for (const part of m[1].split(',')) {
      const token = part.trim().replace(/^type\s+/, '')
      if (!token) continue
      // `A as B` — экспортируется имя B
      const exported = token.split(/\s+as\s+/).pop()!.trim()
      if (exported) names.push(exported)
    }
    if (m[2]) reexportSources.push(m[2])
  }

  EXPORT_STAR_RE.lastIndex = 0
  while ((m = EXPORT_STAR_RE.exec(src)) !== null) {
    if (m[1]) names.push(m[1]) // export * as NS from '...'
    else reexportSources.push(m[2]) // export * from '...'
  }

  return {
    names: [...new Set(names)],
    reexportSources,
    hasDefault: EXPORT_DEFAULT_RE.test(src),
  }
}
