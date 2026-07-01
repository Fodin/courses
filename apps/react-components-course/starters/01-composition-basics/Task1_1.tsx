import { useLanguage } from 'src/hooks'

// ============================================
// Task 1.1 — Card с children и слотами
// Task 1.1 — Card with children and slots
// ============================================
//
// Создайте переиспользуемый компонент Card, который принимает
// Create a reusable Card component that accepts
// header, children и footer как слоты (React.ReactNode).
// header, children, and footer as slots (React.ReactNode).
// Затем создайте три разных варианта карточек через один компонент.
// Then create three different card variants using one component.
//
// Подробное описание: src/exercises/01-composition-basics/task-1.1.md
// Detailed description: src/exercises/01-composition-basics/task-1.1.md

// TODO 1: Определите интерфейс CardProps
// TODO 1: Define the CardProps interface
// - children: React.ReactNode — обязательный
// - children: React.ReactNode — required
// - header?: React.ReactNode — необязательный
// - header?: React.ReactNode — optional
// - footer?: React.ReactNode — необязательный
// - footer?: React.ReactNode — optional

// TODO 2: Реализуйте компонент Card
// TODO 2: Implement the Card component
// - Рендерите header только если он передан: {header && <div>...</div>}
// - Render header only if provided: {header && <div>...</div>}
// - Рендерите footer только если он передан
// - Render footer only if provided
// - Используйте inline styles для оформления (border, borderRadius, boxShadow)
// - Use inline styles for styling (border, borderRadius, boxShadow)

// TODO 3: Создайте компонент ProfileCard
// TODO 3: Create the ProfileCard component
// Используйте Card с:
// Use Card with:
// - header: аватар (цветной div с инициалами) + имя + должность
// - header: avatar (colored div with initials) + name + job title
// - children: биография (текстовый абзац)
// - children: biography (text paragraph)
// - footer: кнопка "Подписаться"
// - footer: "Subscribe" button

// TODO 4: Создайте компонент NotificationCard
// TODO 4: Create the NotificationCard component
// Используйте Card БЕЗ header и footer:
// Use Card WITHOUT header and footer:
// - children: иконка + заголовок уведомления + текст + время
// - children: icon + notification title + text + time

// TODO 5: Создайте компонент ProductCard
// TODO 5: Create the ProductCard component
// Используйте Card с:
// Use Card with:
// - header: название товара + бейдж "Хит"
// - header: product name + "Hit" badge
// - children: описание + цена (оригинальная зачёркнута + скидка)
// - children: description + price (original strikethrough + discount)
// - footer: две кнопки — "В корзину" и "Купить сейчас"
// - footer: two buttons — "Add to Cart" and "Buy Now"

export function Task1_1() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100%' }}>
      <h2 style={{ marginTop: 0, marginBottom: 24 }}>{t('task.title')} 1.1</h2>

      {/* TODO 6: Отрендерите три карточки рядом */}
      {/* TODO 6: Render three cards side by side */}
      {/* Используйте CSS Grid: display: grid, gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 */}
      {/* Use CSS Grid: display: grid, gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 */}
      <div>
        {/* <ProfileCard /> */}
        {/* <NotificationCard /> */}
        {/* <ProductCard /> */}
      </div>
    </div>
  )
}
