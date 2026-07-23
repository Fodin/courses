import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 4.6 (сложное) — Разрыв цикла между сущностями + сборка public API.
 *
 * `entities/user` ссылается на `entities/company` (место работы) объектом целиком, а
 * `entities/company` — на `entities/user` (директор) тоже объектом. Два cross-import'а
 * образуют цикл `user ⇄ company`. У обеих сущностей вдобавок ещё нет `index.ts`.
 * Задача: разорвать обе связи (`companyId`, `ceoId`) и собрать public API каждой
 * сущности, чтобы граф импортов стал корректным — без cross-import одного слоя.
 */

// НАРУШЕНИЕ: user хранит компанию целиком.
const userTypesStart = `import type { Company } from '@/entities/company'

export interface User {
  id: string
  name: string
  company: Company
}
`
const userTypesSolution = `export interface User {
  id: string
  name: string
  companyId: string
}
`

// НАРУШЕНИЕ: company хранит директора целиком.
const companyTypesStart = `import type { User } from '@/entities/user'

export interface Company {
  id: string
  name: string
  ceo: User
}
`
const companyTypesSolution = `export interface Company {
  id: string
  name: string
  ceoId: string
}
`

const userIndexStart = `// Public API слайса entities/user.
// TODO: реэкспортируйте тип User.
`
const userIndexSolution = `export type { User } from './model/types'
`

const companyIndexStart = `// Public API слайса entities/company.
// TODO: реэкспортируйте тип Company.
`
const companyIndexSolution = `export type { Company } from './model/types'
`

export const spec: FsdTaskSpec = {
  id: '4.6',
  title: 'Задание 4.6 — Разрыв цикла и сборка public API (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/user/model/types.ts', content: userTypesStart, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: userIndexStart, role: 'editable' },
    { path: 'src/entities/company/model/types.ts', content: companyTypesStart, role: 'editable' },
    { path: 'src/entities/company/index.ts', content: companyIndexStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/entities/user/model/types.ts', content: userTypesSolution, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: userIndexSolution, role: 'editable' },
    { path: 'src/entities/company/model/types.ts', content: companyTypesSolution, role: 'editable' },
    { path: 'src/entities/company/index.ts', content: companyIndexSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/entities/user/index.ts', 'User', './model/types'),
    exportsFromPublicApi('src/entities/company/index.ts', 'Company', './model/types'),
    fileContains(
      'src/entities/user/model/types.ts',
      /companyId\s*:/,
      'User ссылается на компанию по идентификатору `companyId`, а не объектом'
    ),
    fileContains(
      'src/entities/company/model/types.ts',
      /ceoId\s*:/,
      'Company ссылается на директора по идентификатору `ceoId`, а не объектом'
    ),
  ],
}
