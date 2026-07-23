import { useState } from 'react'

// ============================================
// Задание 13.1: Линтеры границ FSD — типичные нарушения и их починка
// ============================================

interface Violation {
  id: string
  title: string
  rule: string
  bad: string
  message: string
  good: string
  fix: string
}

const VIOLATIONS: Violation[] = [
  {
    id: 'higher',
    title: 'Импорт вверх по слоям',
    rule: 'fsd/no-higher-level-imports',
    bad: `// src/entities/product/model/store.ts
import { addToCart } from '@/features/add-to-cart'`,
    message: 'entities/product импортирует из features/add-to-cart — это выше по слоям.',
    good: `// src/features/add-to-cart/model/store.ts
import { Product } from '@/entities/product'`,
    fix: 'Переверните зависимость: сущность не знает о фиче, фича берёт сущность как материал.',
  },
  {
    id: 'cross',
    title: 'Cross-import соседей по слою',
    rule: 'fsd/no-cross-imports',
    bad: `// src/entities/order/model/types.ts
import { Product } from '@/entities/product'`,
    message: 'entities/order импортирует entities/product — слайсы одного слоя изолированы.',
    good: `// src/entities/product/@x/order.ts
export type { Product } from '../model/types'

// src/entities/order/model/types.ts
import type { Product } from '@/entities/product/@x/order'`,
    fix: 'Поднимите композицию на слой выше или используйте явную @x-нотацию для точечной связи.',
  },
  {
    id: 'deep',
    title: 'Обход public API слайса',
    rule: 'fsd/public-api',
    bad: `// src/pages/checkout/ui/CheckoutPage.tsx
import { CartItem } from '@/entities/cart/ui/CartItem'`,
    message: 'Импорт напрямую из внутреннего сегмента ui, минуя index.ts слайса cart.',
    good: `// src/entities/cart/index.ts
export { CartItem } from './ui/CartItem'

// src/pages/checkout/ui/CheckoutPage.tsx
import { CartItem } from '@/entities/cart'`,
    fix: 'Импортируйте из корня слайса; при необходимости добавьте реэкспорт в index.ts.',
  },
  {
    id: 'insignificant',
    title: 'Слайс без ссылок',
    rule: 'fsd/insignificant-slice',
    bad: `// entities/discount — на слайс нет ни одной ссылки из других слоёв`,
    message: 'Слайс, на который никто не ссылается (или ссылается только @x) — вероятно, лишний.',
    good: `// Либо слайс действительно нужен — тогда его начнут использовать,
// либо код стоит удалить или включить в соседний слайс.`,
    fix: 'Спросите себя: этот слайс действительно должен быть отдельной сущностью?',
  },
  {
    id: 'reserved',
    title: 'Зарезервированное имя подпапки',
    rule: 'fsd/no-reserved-folder-names',
    bad: `src/entities/product/ui/api/fetchProduct.ts`,
    message:
      'Подпапка "api" внутри сегмента "ui" совпадает с именем другого сегмента — путает чтение пути.',
    good: `src/entities/product/api/fetchProduct.ts`,
    fix: 'Вынесите код в сегмент верхнего уровня, которому он реально принадлежит.',
  },
]

export function Task13_1_Solution() {
  const [active, setActive] = useState<string>(VIOLATIONS[0].id)
  const v = VIOLATIONS.find(x => x.id === active)!

  return (
    <div className="exercise-container">
      <h2>Типичные нарушения FSD и правила Steiger</h2>
      <p style={{ color: 'var(--clr-text-muted)' }}>
        Кликните по нарушению, чтобы увидеть, какое правило линтера его ловит, что покажет сообщение
        и как код чинится правильно.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 640 }}>
        {VIOLATIONS.map(item => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid var(--clr-border)',
              cursor: 'pointer',
              fontWeight: item.id === active ? 700 : 500,
              background: item.id === active ? 'rgba(59,130,246,0.15)' : 'var(--clr-bg-secondary)',
              color: 'var(--clr-text)',
            }}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 8,
          border: '1px solid var(--clr-border)',
          background: 'var(--clr-bg-secondary)',
          maxWidth: 640,
        }}
      >
        <h3 style={{ marginTop: 0 }}>{v.title}</h3>
        <p style={{ fontSize: 13, color: 'var(--clr-text-muted)' }}>
          <strong>Правило:</strong> <code>{v.rule}</code>
        </p>

        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>❌ Нарушение</p>
        <pre
          style={{
            background: 'var(--clr-bg)',
            padding: 10,
            borderRadius: 6,
            fontSize: 12,
            overflowX: 'auto',
          }}
        >
          {v.bad}
        </pre>

        <p style={{ fontSize: 13, margin: '8px 0' }}>
          <strong>Сообщение линтера:</strong> {v.message}
        </p>

        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>✅ Починка</p>
        <pre
          style={{
            background: 'var(--clr-bg)',
            padding: 10,
            borderRadius: 6,
            fontSize: 12,
            overflowX: 'auto',
          }}
        >
          {v.good}
        </pre>

        <p style={{ fontSize: 13, color: 'var(--clr-text-muted)', marginTop: 8 }}>💡 {v.fix}</p>
      </div>

      <p style={{ marginTop: 16, fontSize: 14 }}>
        📌 В CI всё это ловится одной командой: <code>npx steiger ./src</code> — PR с любым из этих
        нарушений просто не пройдёт проверку.
      </p>
    </div>
  )
}
