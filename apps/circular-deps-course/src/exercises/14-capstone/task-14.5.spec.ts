import { exportsFromPublicApi, noDeepImport, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 14.5 (среднее) — Тема B «FSD-срез без циклов».
 *
 * Дано: `entities/user/index.ts` не реэкспортирует `updateUserName`, поэтому
 * `features/edit-profile` вынуждено лезть вглубь сущности напрямую —
 * `@/entities/user/model/store` (глубокий импорт). А `entities/user/model/store.ts`,
 * в свою очередь, зовёт `logProfileEdit` напрямую из `features/edit-profile/model/store`
 * (тоже глубокий импорт, да ещё и в обратном направлении) — вместе эти два
 * глубоких импорта замыкают цикл.
 *
 * Задача: навести порядок через public API —
 *  1) убрать из `entities/user/model/store.ts` обратную зависимость от features;
 *  2) реэкспортировать `updateUserName` из `entities/user/index.ts`;
 *  3) в `features/edit-profile` брать `updateUserName` из public API сущности
 *     (`@/entities/user`), а не из внутреннего `model/store`.
 */

const userStoreStart = `import { logProfileEdit } from '@/features/edit-profile/model/store'

export interface User {
  id: string
  name: string
}

const state: User = { id: 'u1', name: 'Ann' }

export function getUser(): User {
  return state
}

// TODO: entities не должен звать features. Удалите импорт logProfileEdit
// и вызов ниже — оповещение об изменении должно идти из features, а не из
// самой сущности.
export function updateUserName(name: string): void {
  state.name = name
  logProfileEdit(name)
}
`

const userStoreSolution = `export interface User {
  id: string
  name: string
}

const state: User = { id: 'u1', name: 'Ann' }

export function getUser(): User {
  return state
}

export function updateUserName(name: string): void {
  state.name = name
}
`

const userIndexStart = `export { getUser } from './model/store'
export type { User } from './model/store'

// TODO: добавьте реэкспорт updateUserName, чтобы features брало его через
// публичный API, а не лезло внутрь entities/user/model/store напрямую.
`

const userIndexSolution = `export { getUser, updateUserName } from './model/store'
export type { User } from './model/store'
`

const editProfileStoreStart = `import { updateUserName } from '@/entities/user/model/store'

// TODO: импортируйте updateUserName из '@/entities/user' (публичный API
// сущности), а не из внутреннего model/store — это глубокий импорт.
export function saveProfile(name: string): void {
  updateUserName(name)
}

export function logProfileEdit(name: string): void {
  console.log('profile edited:', name)
}
`

const editProfileStoreSolution = `import { updateUserName } from '@/entities/user'

export function saveProfile(name: string): void {
  updateUserName(name)
}

export function logProfileEdit(name: string): void {
  console.log('profile edited:', name)
}
`

const editProfileIndex = `export { saveProfile } from './model/store'
`

export const spec: LabSpec = {
  id: '14.5',
  title: 'Задание 14.5 — FSD-срез без циклов: вернуть к public API (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/user/model/store.ts', content: userStoreStart, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: userIndexStart, role: 'editable' },
    {
      path: 'src/features/edit-profile/model/store.ts',
      content: editProfileStoreStart,
      role: 'editable',
    },
    { path: 'src/features/edit-profile/index.ts', content: editProfileIndex, role: 'readonly' },
  ],
  solution: [
    { path: 'src/entities/user/model/store.ts', content: userStoreSolution, role: 'editable' },
    { path: 'src/entities/user/index.ts', content: userIndexSolution, role: 'editable' },
    {
      path: 'src/features/edit-profile/model/store.ts',
      content: editProfileStoreSolution,
      role: 'editable',
    },
    { path: 'src/features/edit-profile/index.ts', content: editProfileIndex, role: 'readonly' },
  ],
  checks: [
    noRuntimeCycles(),
    noDeepImport(),
    exportsFromPublicApi('src/entities/user/index.ts', 'updateUserName', './model/store'),
  ],
}
