import {
  exportsFromPublicApi,
  fileContains,
  fileExists,
  importsRespectLayers,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 12.5 (среднее) — Домен в shared.
 *
 * Интерфейс `Notification` — доменная сущность, но лежит в `shared/lib`. Задача:
 * перенести его в новый слайс `entities/notification` (с public API) и переключить
 * потребителя на импорт оттуда.
 */

// НАРУШЕНИЕ: доменная сущность лежит в shared, "чтобы переиспользовать".
const sharedNotificationStart = `export interface Notification {
  id: string
  userId: string
  message: string
  read: boolean
}
`

const sharedNotificationSolution = `// Notification — доменная сущность, перенесена в entities/notification.
export {}
`

const notificationTypesStart = `// TODO: перенесите сюда интерфейс Notification из shared/lib/notification.ts
export {}
`

const notificationTypesSolution = `export interface Notification {
  id: string
  userId: string
  message: string
  read: boolean
}
`

const notificationIndexStart = `// TODO: экспортируйте тип Notification из ./model/types
export {}
`

const notificationIndexSolution = `export type { Notification } from './model/types'
`

// НАРУШЕНИЕ: feature лезет глубоко в shared/lib за доменным типом.
const inboxStart = `import type { Notification } from '@/shared/lib/notification'

interface Props {
  items: Notification[]
}

export function countUnread({ items }: Props): number {
  return items.filter(item => !item.read).length
}
`

const inboxSolution = `import type { Notification } from '@/entities/notification'

interface Props {
  items: Notification[]
}

export function countUnread({ items }: Props): number {
  return items.filter(item => !item.read).length
}
`

export const spec: FsdTaskSpec = {
  id: '12.5',
  title: 'Задание 12.5 — Домен в shared (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/shared/lib/notification.ts', content: sharedNotificationStart, role: 'editable' },
    {
      path: 'src/entities/notification/model/types.ts',
      content: notificationTypesStart,
      role: 'editable',
    },
    {
      path: 'src/entities/notification/index.ts',
      content: notificationIndexStart,
      role: 'editable',
    },
    { path: 'src/features/inbox/model/inbox.ts', content: inboxStart, role: 'editable' },
  ],
  solution: [
    {
      path: 'src/shared/lib/notification.ts',
      content: sharedNotificationSolution,
      role: 'editable',
    },
    {
      path: 'src/entities/notification/model/types.ts',
      content: notificationTypesSolution,
      role: 'editable',
    },
    {
      path: 'src/entities/notification/index.ts',
      content: notificationIndexSolution,
      role: 'editable',
    },
    { path: 'src/features/inbox/model/inbox.ts', content: inboxSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    fileExists('src/entities/notification/model/types.ts'),
    exportsFromPublicApi('src/entities/notification/index.ts', 'Notification', './model/types'),
    fileContains(
      'src/shared/lib/notification.ts',
      /^(?:(?!interface Notification)[\s\S])*$/,
      'В shared/lib/notification.ts больше нет доменного интерфейса Notification'
    ),
    fileContains(
      'src/features/inbox/model/inbox.ts',
      /from\s+'@\/entities\/notification'/,
      'Feature импортирует Notification из entities/notification, а не из shared'
    ),
    fileContains(
      'src/features/inbox/model/inbox.ts',
      /^(?:(?!shared\/lib\/notification)[\s\S])*$/,
      'В inbox.ts не осталось импорта из shared/lib/notification'
    ),
  ],
}
