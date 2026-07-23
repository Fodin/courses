import { exportsFromPublicApi, fileContains, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 3.3 (сложное) — Наводим порядок во всём shared.
 *
 * В `shared` уже лежат четыре независимых сегмента: `ui` (Button), `api`
 * (apiClient), `lib` (useDebounce), `config` (константы). У каждого — свой
 * реализованный файл, но ни у одного нет `index.ts`. Виджет `widgets/product-search`
 * тянет все четыре сегмента глубокими импортами. Задача: собрать public API у
 * каждого сегмента и перевести виджет на них — вход в shared всегда через
 * `index.ts` сегмента, а не через его внутренний файл.
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

const apiClientTs = `export interface ApiClient {
  get<T>(path: string): Promise<T>
}

export const apiClient: ApiClient = {
  async get(path) {
    const res = await fetch(path)
    return res.json()
  },
}
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

const constantsTs = `export const API_BASE_URL = '/api/v1'
`

const uiIndexStart = `// Public API сегмента shared/ui.
// TODO: реэкспортируйте Button.
`
const apiIndexStart = `// Public API сегмента shared/api.
// TODO: реэкспортируйте apiClient.
`
const libIndexStart = `// Public API сегмента shared/lib.
// TODO: реэкспортируйте useDebounce.
`
const configIndexStart = `// Public API сегмента shared/config.
// TODO: реэкспортируйте API_BASE_URL.
`

const uiIndexSolution = `export { Button } from './Button'
export type { ButtonProps } from './Button'
`
const apiIndexSolution = `export { apiClient } from './apiClient'
export type { ApiClient } from './apiClient'
`
const libIndexSolution = `export { useDebounce } from './useDebounce'
`
const configIndexSolution = `export { API_BASE_URL } from './constants'
`

// НАРУШЕНИЕ: виджет тянет все четыре сегмента shared глубокими импортами.
const widgetStart = `import { useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { apiClient } from '@/shared/api/apiClient'
import { useDebounce } from '@/shared/lib/useDebounce'
import { API_BASE_URL } from '@/shared/config/constants'

interface Product {
  id: string
  title: string
}

export function ProductSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const search = async () => {
    await apiClient.get<Product[]>(\`\${API_BASE_URL}/products?q=\${debouncedQuery}\`)
  }

  return (
    <div className="product-search">
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <Button label="Искать" onClick={search} />
    </div>
  )
}
`

const widgetSolution = `import { useState } from 'react'
import { Button } from '@/shared/ui'
import { apiClient } from '@/shared/api'
import { useDebounce } from '@/shared/lib'
import { API_BASE_URL } from '@/shared/config'

interface Product {
  id: string
  title: string
}

export function ProductSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const search = async () => {
    await apiClient.get<Product[]>(\`\${API_BASE_URL}/products?q=\${debouncedQuery}\`)
  }

  return (
    <div className="product-search">
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <Button label="Искать" onClick={search} />
    </div>
  )
}
`

const roFiles = [
  { path: 'src/shared/ui/Button.tsx', content: buttonTsx, role: 'readonly' as const },
  { path: 'src/shared/api/apiClient.ts', content: apiClientTs, role: 'readonly' as const },
  { path: 'src/shared/lib/useDebounce.ts', content: useDebounceTs, role: 'readonly' as const },
  { path: 'src/shared/config/constants.ts', content: constantsTs, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '3.3',
  title: 'Задание 3.3 — Наводим порядок во всём shared (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/shared/ui/index.ts', content: uiIndexStart, role: 'editable' },
    { path: 'src/shared/api/index.ts', content: apiIndexStart, role: 'editable' },
    { path: 'src/shared/lib/index.ts', content: libIndexStart, role: 'editable' },
    { path: 'src/shared/config/index.ts', content: configIndexStart, role: 'editable' },
    {
      path: 'src/widgets/product-search/ui/ProductSearch.tsx',
      content: widgetStart,
      role: 'editable',
    },
  ],
  solution: [
    ...roFiles,
    { path: 'src/shared/ui/index.ts', content: uiIndexSolution, role: 'editable' },
    { path: 'src/shared/api/index.ts', content: apiIndexSolution, role: 'editable' },
    { path: 'src/shared/lib/index.ts', content: libIndexSolution, role: 'editable' },
    { path: 'src/shared/config/index.ts', content: configIndexSolution, role: 'editable' },
    {
      path: 'src/widgets/product-search/ui/ProductSearch.tsx',
      content: widgetSolution,
      role: 'editable',
    },
  ],
  checks: [
    exportsFromPublicApi('src/shared/ui/index.ts', 'Button', './Button'),
    exportsFromPublicApi('src/shared/api/index.ts', 'apiClient', './apiClient'),
    exportsFromPublicApi('src/shared/lib/index.ts', 'useDebounce', './useDebounce'),
    exportsFromPublicApi('src/shared/config/index.ts', 'API_BASE_URL', './constants'),
    fileContains(
      'src/widgets/product-search/ui/ProductSearch.tsx',
      /from\s*'@\/shared\/ui'/,
      'Button — через public API `@/shared/ui`'
    ),
    fileContains(
      'src/widgets/product-search/ui/ProductSearch.tsx',
      /from\s*'@\/shared\/api'/,
      'apiClient — через public API `@/shared/api`'
    ),
    fileContains(
      'src/widgets/product-search/ui/ProductSearch.tsx',
      /from\s*'@\/shared\/lib'/,
      'useDebounce — через public API `@/shared/lib`'
    ),
    fileContains(
      'src/widgets/product-search/ui/ProductSearch.tsx',
      /from\s*'@\/shared\/config'/,
      'API_BASE_URL — через public API `@/shared/config`'
    ),
  ],
}
