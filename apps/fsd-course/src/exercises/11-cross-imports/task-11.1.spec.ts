import { fileContains, fileExists, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 11.1 (простое) — Первый @x-контракт.
 *
 * `entities/product` хранит собственную узкую проекцию продавца — тип `User`,
 * описывающий только то, что нужно карточке товара (id + отображаемое имя). Этот
 * тип НЕ входит в обычный public API продукта (`index.ts` отдаёт только `Product`).
 * `entities/user` хочет переиспользовать именно эту форму в своём компоненте
 * `SellerBadge`, но не имеет права ни на глубокий импорт, ни на прямой cross-import
 * `entities/product`. Единственный разрешённый канал — управляемый @x-контракт
 * `entities/product/@x/user.ts`.
 */

const productTypes = `export interface Product {
  id: string
  title: string
}

// Узкая проекция продавца с точки зрения product — только то, что нужно
// карточке товара. Это НЕ часть обычного public API (index.ts её не отдаёт).
export interface User {
  id: string
  displayName: string
}
`

const productIndex = `export type { Product } from './model/types'
`

// TODO для ученика: реэкспортировать тип User специально для entities/user.
const xUserStart = `// TODO: entities/user хочет переиспользовать тип \`User\`, который product
// определяет для своих нужд (проекция продавца). Реэкспортируйте его здесь —
// это единственный разрешённый канал для entities/user.
export {}
`

const xUserSolution = `// @x-контракт: product -> user. Имя файла = имя слайса-потребителя, которому
// разрешено сюда заглядывать.
export type { User } from '../model/types'
`

const sellerBadgeStart = `// TODO: импортируйте тип \`User\` из product через @x-контракт
// '@/entities/product/@x/user' и используйте его в пропсах компонента.

export function SellerBadge() {
  return null
}
`

const sellerBadgeSolution = `import type { User } from '@/entities/product/@x/user'

export function SellerBadge({ seller }: { seller: User }) {
  return <span className="seller-badge">{seller.displayName}</span>
}
`

const roFiles = [
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '11.1',
  title: 'Задание 11.1 — Первый @x-контракт (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/product/@x/user.ts', content: xUserStart, role: 'editable' },
    { path: 'src/entities/user/ui/SellerBadge.tsx', content: sellerBadgeStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/product/@x/user.ts', content: xUserSolution, role: 'editable' },
    { path: 'src/entities/user/ui/SellerBadge.tsx', content: sellerBadgeSolution, role: 'editable' },
  ],
  checks: [
    fileExists('src/entities/product/@x/user.ts'),
    fileContains(
      'src/entities/product/@x/user.ts',
      /export .*User/,
      'Файл `@x/user.ts` реэкспортирует тип `User`'
    ),
    fileContains(
      'src/entities/user/ui/SellerBadge.tsx',
      /@x\/user/,
      'SellerBadge импортирует тип через `@/entities/product/@x/user`, а не напрямую'
    ),
  ],
}
