import { noRuntimeCycles, fileExists, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 7.8 (среднее) — Вынос общего в третий модуль: цикл длиной 3.
 *
 * Дано: product.ts → order.ts → customer.ts → product.ts — три типа, каждый
 * из которых ссылается на следующий. Задача: вынести все три типа в новый
 * файл shared.ts, а product.ts/order.ts/customer.ts оставить с функциями,
 * типизированными через `import type` из shared.ts.
 */

const productStart = `import { Order } from './order'

export interface Product {
  id: string
  relatedOrder: Order
}
`

const orderStart = `import { Customer } from './customer'

export interface Order {
  id: string
  customer: Customer
}
`

const customerStart = `import { Product } from './product'

export interface Customer {
  id: string
  favoriteProduct: Product
}
`

const sharedStart = `// TODO: вынесите сюда общие типы Product, Order и Customer,
// которые сейчас циклически ссылаются друг на друга: product → order → customer → product.
`

const sharedSolution = `export interface Product {
  id: string
  relatedOrder: Order
}

export interface Order {
  id: string
  customer: Customer
}

export interface Customer {
  id: string
  favoriteProduct: Product
}
`

const productSolution = `import type { Product } from './shared'

export function createProduct(id: string, relatedOrder: Product['relatedOrder']): Product {
  return { id, relatedOrder }
}
`

const orderSolution = `import type { Order } from './shared'

export function createOrder(id: string, customer: Order['customer']): Order {
  return { id, customer }
}
`

const customerSolution = `import type { Customer } from './shared'

export function createCustomer(
  id: string,
  favoriteProduct: Customer['favoriteProduct']
): Customer {
  return { id, favoriteProduct }
}
`

export const spec: LabSpec = {
  id: '7.8',
  title: 'Задание 7.8 — Вынос общего в третий модуль: цикл длиной 3 (среднее)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/product.ts', content: productStart, role: 'editable' },
    { path: 'src/order.ts', content: orderStart, role: 'editable' },
    { path: 'src/customer.ts', content: customerStart, role: 'editable' },
    { path: 'src/shared.ts', content: sharedStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/product.ts', content: productSolution, role: 'editable' },
    { path: 'src/order.ts', content: orderSolution, role: 'editable' },
    { path: 'src/customer.ts', content: customerSolution, role: 'editable' },
    { path: 'src/shared.ts', content: sharedSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileExists('src/shared.ts'),
    fileContains(
      'src/shared.ts',
      /interface\s+Product/,
      '`shared.ts` содержит `interface Product`'
    ),
    fileContains('src/shared.ts', /interface\s+Order/, '`shared.ts` содержит `interface Order`'),
    fileContains(
      'src/shared.ts',
      /interface\s+Customer/,
      '`shared.ts` содержит `interface Customer`'
    ),
  ],
}
