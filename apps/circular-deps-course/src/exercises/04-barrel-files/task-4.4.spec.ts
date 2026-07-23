import { fileContains, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 4.4 (простое) — модуль внутри пакета берёт тип соседа через
 * собственный barrel.
 *
 * `panel.ts` использует тип `Size`, объявленный в `widget.ts`, но импортирует
 * его через `./index` вместо прямого пути. Barrel реэкспортирует `panel.ts` —
 * self-loop `panel → index → panel`. Правило то же, что и в 4.1, но здесь
 * замыкание происходит именно на общем типе — частый случай в реальных
 * пакетах, где типы «расползаются» по barrel.
 */

const indexContent = `import { Size, Widget } from './widget'
import { Panel } from './panel'

export { Size, Widget, Panel }
`

const widgetContent = `export interface Size {
  width: number
  height: number
}

export function Widget(size: Size): string {
  return \`widget:\${size.width}x\${size.height}\`
}
`

const panelStart = `import { Size } from './index' // TODO: убери самозамыкание — импортируй Size напрямую из './widget'

export function Panel(size: Size): string {
  return \`panel:\${size.width}x\${size.height}\`
}
`

const panelSolution = `import { Size } from './widget'

export function Panel(size: Size): string {
  return \`panel:\${size.width}x\${size.height}\`
}
`

export const spec: LabSpec = {
  id: '4.4',
  title: 'Задание 4.4 — Самозамыкание на общем типе через barrel (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/index.ts', content: indexContent, role: 'readonly' },
    { path: 'src/widget.ts', content: widgetContent, role: 'readonly' },
    { path: 'src/panel.ts', content: panelStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/index.ts', content: indexContent, role: 'readonly' },
    { path: 'src/widget.ts', content: widgetContent, role: 'readonly' },
    { path: 'src/panel.ts', content: panelSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileContains(
      'src/panel.ts',
      /from\s*'\.\/widget'/,
      "panel.ts импортирует Size напрямую из './widget'"
    ),
  ],
}
