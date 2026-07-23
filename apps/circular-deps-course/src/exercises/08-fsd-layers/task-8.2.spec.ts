import { importsRespectLayers, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 8.2 (среднее) — Цепочка через три слоя, замкнутая одним импортом вверх.
 *
 * `widgets/header` → `features/notifications-bell` → `entities/notification` —
 * три исправных импорта «вниз». Но `entities/notification` тянет значение из
 * `widgets/header` (импорт «вверх» через два слоя сразу), и цепочка замыкается
 * в цикл `widgets → features → entities → widgets`.
 *
 * Задача: убрать импорт «вверх» из `entities/notification`, не трогая
 * `widgets` и `features`.
 */

const headerUi = `import { NotificationsBell } from '../../../features/notifications-bell/ui/NotificationsBell'

export const HEADER_TITLE = 'App Header'

export function Header(): string {
  return \`\${HEADER_TITLE}: \${NotificationsBell()}\`
}
`

const bellUi = `import { getUnreadCount } from '../../../entities/notification/model/notification'

export function NotificationsBell(): string {
  return \`Bell(\${getUnreadCount()})\`
}
`

const notificationModelStart = `import { HEADER_TITLE } from '../../../widgets/header/ui/Header'

export function getUnreadCount(): number {
  return HEADER_TITLE.length
}
`

const notificationModelSolution = `export function getUnreadCount(): number {
  return 3
}
`

export const spec: LabSpec = {
  id: '8.2',
  title: 'Задание 8.2 — Цепочка через три слоя, замкнутая импортом вверх (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/widgets/header/ui/Header.tsx', content: headerUi, role: 'readonly' },
    {
      path: 'src/features/notifications-bell/ui/NotificationsBell.tsx',
      content: bellUi,
      role: 'readonly',
    },
    {
      path: 'src/entities/notification/model/notification.ts',
      content: notificationModelStart,
      role: 'editable',
    },
  ],
  solution: [
    { path: 'src/widgets/header/ui/Header.tsx', content: headerUi, role: 'readonly' },
    {
      path: 'src/features/notifications-bell/ui/NotificationsBell.tsx',
      content: bellUi,
      role: 'readonly',
    },
    {
      path: 'src/entities/notification/model/notification.ts',
      content: notificationModelSolution,
      role: 'editable',
    },
  ],
  checks: [noRuntimeCycles(), importsRespectLayers()],
}
