import { fileContains, fileExists, noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 14.2 (среднее) — Тема A «Распутать модульный граф».
 *
 * Дано: 5 модулей. `discount.ts` и `tax.ts` — равноправные модули, которые
 * взаимно зависят друг от друга по рантайму (`discount.ts` зовёт
 * `formatCurrency` из `tax.ts`, `tax.ts` зовёт `discountRate` из
 * `discount.ts`) — классический цикл «два равноправных модуля». `cart.ts`
 * потребляет оба модуля и циклом не затронут. `format.ts` — заготовка
 * третьего модуля, пока пустая.
 *
 * Задача: вынести общую логику форматирования (`formatCurrency`) в
 * `format.ts` — третий модуль, от которого `discount.ts` зависит
 * однонаправленно, а `tax.ts` вообще перестаёт в нём нуждаться.
 */

const constantsFile = `export const CURRENCY_SYMBOL = '$'
`

const formatStart = `// TODO: этот модуль — заготовка «третьего модуля». Вынесите сюда
// formatCurrency из tax.ts — общую логику, из-за которой discount.ts и
// tax.ts сейчас зависят друг от друга по кругу.
export {}
`

const formatSolution = `export function formatCurrency(amount: number): string {
  return \`$\${amount.toFixed(2)}\`
}
`

const discountStart = `import { formatCurrency } from './tax'

export const discountRate = 0.1

export function describeDiscount(amount: number): string {
  return \`discount: \${formatCurrency(amount * discountRate)}\`
}
`

const discountSolution = `import { formatCurrency } from './format'

export const discountRate = 0.1

export function describeDiscount(amount: number): string {
  return \`discount: \${formatCurrency(amount * discountRate)}\`
}
`

const taxStart = `import { discountRate } from './discount'

// TODO: formatCurrency больше не должен жить здесь — перенесите его в
// format.ts (третий модуль) и удалите отсюда, tax.ts им не пользуется.
export function formatCurrency(amount: number): string {
  return \`$\${amount.toFixed(2)}\`
}

export function describeTax(amount: number): string {
  return \`tax (after discount rate \${discountRate}): $\${(amount * 0.2).toFixed(2)}\`
}
`

const taxSolution = `import { discountRate } from './discount'

export function describeTax(amount: number): string {
  return \`tax (after discount rate \${discountRate}): $\${(amount * 0.2).toFixed(2)}\`
}
`

const cartFile = `import { describeDiscount } from './discount'
import { describeTax } from './tax'
import { CURRENCY_SYMBOL } from './constants'

export function printReceipt(amount: number): string {
  return \`\${CURRENCY_SYMBOL} \${describeDiscount(amount)} | \${describeTax(amount)}\`
}
`

export const spec: LabSpec = {
  id: '14.2',
  title: 'Задание 14.2 — Распутать модульный граф: третий модуль (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/constants.ts', content: constantsFile, role: 'readonly' },
    { path: 'src/format.ts', content: formatStart, role: 'editable' },
    { path: 'src/discount.ts', content: discountStart, role: 'editable' },
    { path: 'src/tax.ts', content: taxStart, role: 'editable' },
    { path: 'src/cart.ts', content: cartFile, role: 'readonly' },
  ],
  solution: [
    { path: 'src/constants.ts', content: constantsFile, role: 'readonly' },
    { path: 'src/format.ts', content: formatSolution, role: 'editable' },
    { path: 'src/discount.ts', content: discountSolution, role: 'editable' },
    { path: 'src/tax.ts', content: taxSolution, role: 'editable' },
    { path: 'src/cart.ts', content: cartFile, role: 'readonly' },
  ],
  checks: [
    noRuntimeCycles(),
    fileExists('src/format.ts'),
    fileContains('src/format.ts', /formatCurrency/, '`format.ts` содержит `formatCurrency`'),
    fileContains(
      'src/discount.ts',
      /from '\.\/format'/,
      '`discount.ts` берёт `formatCurrency` из третьего модуля `./format`'
    ),
  ],
}
