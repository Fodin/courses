import { importsRespectLayers, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 8.3 (сложное) — Несколько нарушений направления образуют один цикл.
 *
 * Четыре слоя связаны в кольцо:
 *   shared → entities → features → widgets → shared
 * Три ребра (shared→entities, entities→features, features→widgets) идут
 * «вверх» и запрещены правилами FSD; четвёртое (widgets→shared) идёт «вниз»
 * и само по себе разрешено, но замыкает кольцо в цикл.
 *
 * Задача: убрать все три импорта «вверх» (в трёх разных файлах), не трогая
 * `widgets/auth-widget`.
 */

const authWidgetUi = `import { formatUserName } from '../../../shared/lib/format-user'

export function AuthWidget(first: string, last: string): string {
  return \`Welcome, \${formatUserName(first, last)}\`
}
`

const formatUserStart = `import { DEFAULT_USER_NAME } from '../../entities/user/model/user'

export function formatUserName(first: string, last: string): string {
  return \`\${first || DEFAULT_USER_NAME} \${last}\`
}
`

const formatUserSolution = `export function formatUserName(first: string, last: string): string {
  return \`\${first || 'Guest'} \${last}\`
}
`

const userModelStart = `import { isAuthEnabled } from '../../../features/auth/model/auth'

export const DEFAULT_USER_NAME = isAuthEnabled() ? 'Guest' : 'Anonymous'

export interface User {
  id: string
  name: string
}
`

const userModelSolution = `export const DEFAULT_USER_NAME = 'Anonymous'

export interface User {
  id: string
  name: string
}
`

const authModelStart = `import { AuthWidget } from '../../../widgets/auth-widget/ui/AuthWidget'

export function isAuthEnabled(): boolean {
  return typeof AuthWidget === 'function'
}
`

const authModelSolution = `export function isAuthEnabled(): boolean {
  return true
}
`

export const spec: LabSpec = {
  id: '8.3',
  title: 'Задание 8.3 — Несколько нарушений направления образуют один цикл (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/widgets/auth-widget/ui/AuthWidget.tsx', content: authWidgetUi, role: 'readonly' },
    { path: 'src/shared/lib/format-user.ts', content: formatUserStart, role: 'editable' },
    { path: 'src/entities/user/model/user.ts', content: userModelStart, role: 'editable' },
    { path: 'src/features/auth/model/auth.ts', content: authModelStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/widgets/auth-widget/ui/AuthWidget.tsx', content: authWidgetUi, role: 'readonly' },
    { path: 'src/shared/lib/format-user.ts', content: formatUserSolution, role: 'editable' },
    { path: 'src/entities/user/model/user.ts', content: userModelSolution, role: 'editable' },
    { path: 'src/features/auth/model/auth.ts', content: authModelSolution, role: 'editable' },
  ],
  checks: [noRuntimeCycles(), importsRespectLayers()],
}
