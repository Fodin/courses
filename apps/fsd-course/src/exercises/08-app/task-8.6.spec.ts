import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 8.6 (сложное) — Распутать три слоя, тянущих из app.
 *
 * Сразу три нижних слоя завязаны на `app/config/appConfig`: `entities/product`
 * (URL API), `features/cart` (фиче-флаг) и `widgets/header` (тот же URL). Это
 * граф с несколькими импортами «вверх» в app. Нужный конфиг уже вынесен в
 * `shared/config/appConfig` (готов, только чтение) — app остаётся только точкой
 * сборки, а не источником общих данных. Задача: переключить все три слайса на
 * shared и собрать полноценный public API там, где он неполный.
 */

const appConfig = `export const API_BASE_URL = 'https://api.shop.dev'
export const FEATURE_FLAGS = { newCheckout: true }
`
const sharedConfig = `export const API_BASE_URL = 'https://api.shop.dev'
export const FEATURE_FLAGS = { newCheckout: true }
`

const productApiStart = `import { API_BASE_URL } from '@/app/config/appConfig'

// TODO: возьмите API_BASE_URL из '@/shared/config/appConfig', а не из app.
export function productUrl(id: string): string {
  return \`\${API_BASE_URL}/products/\${id}\`
}
`
const productApiSolution = `import { API_BASE_URL } from '@/shared/config/appConfig'

export function productUrl(id: string): string {
  return \`\${API_BASE_URL}/products/\${id}\`
}
`
const productIndex = `export { productUrl } from './model/api'
`

const cartCheckoutStart = `import { FEATURE_FLAGS } from '@/app/config/appConfig'

// TODO: возьмите FEATURE_FLAGS из '@/shared/config/appConfig', а не из app.
export function useNewCheckout(): boolean {
  return FEATURE_FLAGS.newCheckout
}
`
const cartCheckoutSolution = `import { FEATURE_FLAGS } from '@/shared/config/appConfig'

export function useNewCheckout(): boolean {
  return FEATURE_FLAGS.newCheckout
}
`
const cartIndex = `export { useNewCheckout } from './model/checkout'
`

const headerStart = `import { API_BASE_URL } from '@/app/config/appConfig'

// TODO: возьмите API_BASE_URL из '@/shared/config/appConfig', а не из app.
export function Header() {
  return (
    <header className="header" data-api={API_BASE_URL}>
      Shop
    </header>
  )
}
`
const headerSolution = `import { API_BASE_URL } from '@/shared/config/appConfig'

export function Header() {
  return (
    <header className="header" data-api={API_BASE_URL}>
      Shop
    </header>
  )
}
`
const headerIndex = `export { Header } from './ui/Header'
`

const roFiles = [
  { path: 'src/app/config/appConfig.ts', content: appConfig, role: 'readonly' as const },
  { path: 'src/shared/config/appConfig.ts', content: sharedConfig, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
  { path: 'src/features/cart/index.ts', content: cartIndex, role: 'readonly' as const },
  { path: 'src/widgets/header/index.ts', content: headerIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '8.6',
  title: 'Задание 8.6 — Распутать три слоя, тянущих из app (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/product/model/api.ts', content: productApiStart, role: 'editable' },
    { path: 'src/features/cart/model/checkout.ts', content: cartCheckoutStart, role: 'editable' },
    { path: 'src/widgets/header/ui/Header.tsx', content: headerStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/product/model/api.ts', content: productApiSolution, role: 'editable' },
    { path: 'src/features/cart/model/checkout.ts', content: cartCheckoutSolution, role: 'editable' },
    { path: 'src/widgets/header/ui/Header.tsx', content: headerSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/entities/product/model/api.ts',
      /from\s*'@\/shared\/config\/appConfig'/,
      "productUrl берёт API_BASE_URL из '@/shared/config/appConfig'"
    ),
    fileContains(
      'src/features/cart/model/checkout.ts',
      /from\s*'@\/shared\/config\/appConfig'/,
      "useNewCheckout берёт FEATURE_FLAGS из '@/shared/config/appConfig'"
    ),
    fileContains(
      'src/widgets/header/ui/Header.tsx',
      /from\s*'@\/shared\/config\/appConfig'/,
      "Header берёт API_BASE_URL из '@/shared/config/appConfig'"
    ),
    exportsFromPublicApi('src/entities/product/index.ts', 'productUrl', './model/api'),
    exportsFromPublicApi('src/features/cart/index.ts', 'useNewCheckout', './model/checkout'),
    exportsFromPublicApi('src/widgets/header/index.ts', 'Header', './ui/Header'),
  ],
}
