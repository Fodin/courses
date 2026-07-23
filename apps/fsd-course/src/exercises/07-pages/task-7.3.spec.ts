import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 7.3 (сложное) — Страница из нескольких виджетов и фич.
 *
 * `pages/checkout` собирает один виджет (`widgets/order-summary`) и две фичи
 * (`features/checkout-form`, `features/apply-promo`). Все три импорта —
 * глубокие, страница лезет во внутренние `ui/`-сегменты. Задача: навести
 * порядок — перевести все импорты на public API и собрать полный public API
 * самой страницы.
 */

const orderSummary = `export function OrderSummary({ total }: { total: number }) {
  return (
    <div className="order-summary">
      <strong>Итого: {total} ₽</strong>
    </div>
  )
}
`
const orderSummaryIndex = `export { OrderSummary } from './ui/OrderSummary'
`

const checkoutForm = `export function CheckoutForm() {
  return (
    <form className="checkout-form">
      <input name="address" placeholder="Адрес доставки" />
    </form>
  )
}
`
const checkoutFormIndex = `export { CheckoutForm } from './ui/CheckoutForm'
`

const promoForm = `export function PromoForm() {
  return (
    <form className="promo-form">
      <input name="promo" placeholder="Промокод" />
    </form>
  )
}
`
const promoFormIndex = `export { PromoForm } from './ui/PromoForm'
`

// НАРУШЕНИЕ: три глубоких импорта мимо public API виджета и фич.
const checkoutPageStart = `import { OrderSummary } from '@/widgets/order-summary/ui/OrderSummary'
import { CheckoutForm } from '@/features/checkout-form/ui/CheckoutForm'
import { PromoForm } from '@/features/apply-promo/ui/PromoForm'

export function CheckoutPage() {
  return (
    <div className="checkout-page">
      <CheckoutForm />
      <PromoForm />
      <OrderSummary total={4990} />
    </div>
  )
}
`

const checkoutPageSolution = `import { CheckoutForm } from '@/features/checkout-form'
import { PromoForm } from '@/features/apply-promo'
import { OrderSummary } from '@/widgets/order-summary'

export function CheckoutPage() {
  return (
    <div className="checkout-page">
      <CheckoutForm />
      <PromoForm />
      <OrderSummary total={4990} />
    </div>
  )
}
`

const pageIndexStart = `// Public API страницы pages/checkout.
// TODO: соберите публичный интерфейс — реэкспортируйте CheckoutPage.
`
const pageIndexSolution = `export { CheckoutPage } from './ui/CheckoutPage'
`

const roFiles = [
  {
    path: 'src/widgets/order-summary/ui/OrderSummary.tsx',
    content: orderSummary,
    role: 'readonly' as const,
  },
  {
    path: 'src/widgets/order-summary/index.ts',
    content: orderSummaryIndex,
    role: 'readonly' as const,
  },
  {
    path: 'src/features/checkout-form/ui/CheckoutForm.tsx',
    content: checkoutForm,
    role: 'readonly' as const,
  },
  {
    path: 'src/features/checkout-form/index.ts',
    content: checkoutFormIndex,
    role: 'readonly' as const,
  },
  {
    path: 'src/features/apply-promo/ui/PromoForm.tsx',
    content: promoForm,
    role: 'readonly' as const,
  },
  {
    path: 'src/features/apply-promo/index.ts',
    content: promoFormIndex,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '7.3',
  title: 'Задание 7.3 — Страница из нескольких виджетов и фич (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    {
      path: 'src/pages/checkout/ui/CheckoutPage.tsx',
      content: checkoutPageStart,
      role: 'editable',
    },
    { path: 'src/pages/checkout/index.ts', content: pageIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/pages/checkout/ui/CheckoutPage.tsx',
      content: checkoutPageSolution,
      role: 'editable',
    },
    { path: 'src/pages/checkout/index.ts', content: pageIndexSolution, role: 'editable' },
  ],
  checks: [
    noDeepImport(),
    importsRespectLayers(),
    exportsFromPublicApi('src/pages/checkout/index.ts', 'CheckoutPage', './ui/CheckoutPage'),
    fileContains(
      'src/pages/checkout/ui/CheckoutPage.tsx',
      /from\s*'@\/widgets\/order-summary'/,
      'OrderSummary импортируется через public API виджета `@/widgets/order-summary`'
    ),
    fileContains(
      'src/pages/checkout/ui/CheckoutPage.tsx',
      /from\s*'@\/features\/checkout-form'/,
      'CheckoutForm импортируется через public API фичи `@/features/checkout-form`'
    ),
    fileContains(
      'src/pages/checkout/ui/CheckoutPage.tsx',
      /from\s*'@\/features\/apply-promo'/,
      'PromoForm импортируется через public API фичи `@/features/apply-promo`'
    ),
  ],
}
