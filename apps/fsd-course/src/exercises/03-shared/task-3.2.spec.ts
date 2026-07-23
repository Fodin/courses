import { fileContains, importsRespectLayers, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 3.2 (среднее) — Сборка public API нескольких сегментов shared.
 *
 * `shared/ui` (Button) и `shared/lib` (useDebounce) уже закрыты корректным public
 * API (index.ts, только чтение). Но фича `features/search-bar` тянет их напрямую —
 * `@/shared/ui/Button`, `@/shared/lib/useDebounce`. Задача: переключить импорты
 * фичи на public API сегментов.
 *
 * ⚠️ У `shared` нет предметных слайсов — только сегменты (`ui`, `api`, `lib`,
 * `config`), поэтому `noDeepImport()` глубокие импорты внутрь shared не ловит
 * (импорт shared разрешён откуда угодно и как угодно глубоко). Аккуратность здесь
 * проверяется по факту — какой именно путь стоит в `import`.
 */

const buttonTsx = `export interface ButtonProps {
  label: string
  onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button className="ui-button" onClick={onClick}>
      {label}
    </button>
  )
}
`

const uiIndex = `export { Button } from './Button'
export type { ButtonProps } from './Button'
`

const useDebounceTs = `import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
`

const libIndex = `export { useDebounce } from './useDebounce'
`

// НАРУШЕНИЕ: фича лезет во внутренние файлы сегментов shared вместо их public API.
const searchBarStart = `import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { useDebounce } from '@/shared/lib/useDebounce'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  return (
    <div className="search-bar">
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <span>Ищем: {debouncedQuery}</span>
      <Button label="Найти" onClick={() => {}} />
    </div>
  )
}
`

const searchBarSolution = `import { useState } from 'react'
import { Button } from '@/shared/ui'
import { useDebounce } from '@/shared/lib'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  return (
    <div className="search-bar">
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <span>Ищем: {debouncedQuery}</span>
      <Button label="Найти" onClick={() => {}} />
    </div>
  )
}
`

const roFiles = [
  { path: 'src/shared/ui/Button.tsx', content: buttonTsx, role: 'readonly' as const },
  { path: 'src/shared/ui/index.ts', content: uiIndex, role: 'readonly' as const },
  { path: 'src/shared/lib/useDebounce.ts', content: useDebounceTs, role: 'readonly' as const },
  { path: 'src/shared/lib/index.ts', content: libIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '3.2',
  title: 'Задание 3.2 — Сборка public API нескольких сегментов (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    {
      path: 'src/features/search-bar/ui/SearchBar.tsx',
      content: searchBarStart,
      role: 'editable',
    },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/features/search-bar/ui/SearchBar.tsx',
      content: searchBarSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    fileContains(
      'src/features/search-bar/ui/SearchBar.tsx',
      /from\s*'@\/shared\/ui'/,
      'Button импортируется через public API `@/shared/ui`, а не из файла `Button.tsx`'
    ),
    fileContains(
      'src/features/search-bar/ui/SearchBar.tsx',
      /from\s*'@\/shared\/lib'/,
      'useDebounce импортируется через public API `@/shared/lib`, а не из файла `useDebounce.ts`'
    ),
  ],
}
