import {
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 8.5 (среднее) — Общий конфиг переезжает в shared.
 *
 * И `entities/user`, и `widgets/dashboard` тянут `APP_NAME` прямо из
 * `app/config/appConfig` — оба слоя ниже app, импорт «вверх» запрещён. Тот же
 * конфиг уже продублирован в `shared/config/appConfig` (готов, только чтение).
 * Задача: переключить оба места на shared, чтобы низ не зависел от app.
 */

const appConfig = `export const APP_NAME = 'FSD Shop'
`
const sharedConfig = `export const APP_NAME = 'FSD Shop'
`

const greetingStart = `import { APP_NAME } from '@/app/config/appConfig'

// TODO: возьмите APP_NAME из '@/shared/config/appConfig', а не из app.
export function greeting(userName: string): string {
  return \`\${userName}, добро пожаловать в \${APP_NAME}\`
}
`
const greetingSolution = `import { APP_NAME } from '@/shared/config/appConfig'

export function greeting(userName: string): string {
  return \`\${userName}, добро пожаловать в \${APP_NAME}\`
}
`
const entitiesUserIndex = `export { greeting } from './model/greeting'
`

const dashboardStart = `import { APP_NAME } from '@/app/config/appConfig'

// TODO: возьмите APP_NAME из '@/shared/config/appConfig', а не из app.
export function Dashboard() {
  return <header className="dashboard-header">{APP_NAME}</header>
}
`
const dashboardSolution = `import { APP_NAME } from '@/shared/config/appConfig'

export function Dashboard() {
  return <header className="dashboard-header">{APP_NAME}</header>
}
`
const widgetsDashboardIndex = `export { Dashboard } from './ui/Dashboard'
`

const roFiles = [
  { path: 'src/app/config/appConfig.ts', content: appConfig, role: 'readonly' as const },
  { path: 'src/shared/config/appConfig.ts', content: sharedConfig, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: entitiesUserIndex, role: 'readonly' as const },
  { path: 'src/widgets/dashboard/index.ts', content: widgetsDashboardIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '8.5',
  title: 'Задание 8.5 — Общий конфиг переезжает в shared (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/user/model/greeting.ts', content: greetingStart, role: 'editable' },
    { path: 'src/widgets/dashboard/ui/Dashboard.tsx', content: dashboardStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/user/model/greeting.ts', content: greetingSolution, role: 'editable' },
    { path: 'src/widgets/dashboard/ui/Dashboard.tsx', content: dashboardSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/entities/user/model/greeting.ts',
      /from\s*'@\/shared\/config\/appConfig'/,
      "greeting берёт APP_NAME из '@/shared/config/appConfig', а не из app"
    ),
    fileContains(
      'src/widgets/dashboard/ui/Dashboard.tsx',
      /from\s*'@\/shared\/config\/appConfig'/,
      "Dashboard берёт APP_NAME из '@/shared/config/appConfig', а не из app"
    ),
  ],
}
