import { useLanguage } from 'src/hooks'

// ============================================
// Task 1.1 — Card с children и слотами
// ============================================
//
// Создайте переиспользуемый компонент Card, который принимает
// header, children и footer как слоты (React.ReactNode).
// Затем создайте три разных варианта карточек через один компонент.
//
// Подробное описание: src/exercises/01-composition-basics/task-1.1.md

// TODO 1: Определите интерфейс CardProps
// - children: React.ReactNode — обязательный
// - header?: React.ReactNode — необязательный
// - footer?: React.ReactNode — необязательный

// TODO 2: Реализуйте компонент Card
// - Рендерите header только если он передан: {header && <div>...</div>}
// - Рендерите footer только если он передан
// - Используйте inline styles для оформления (border, borderRadius, boxShadow)

// TODO 3: Создайте компонент ProfileCard
// Используйте Card с:
// - header: аватар (цветной div с инициалами) + имя + должность
// - children: биография (текстовый абзац)
// - footer: кнопка "Подписаться"

// TODO 4: Создайте компонент NotificationCard
// Используйте Card БЕЗ header и footer:
// - children: иконка + заголовок уведомления + текст + время

// TODO 5: Создайте компонент ProductCard
// Используйте Card с:
// - header: название товара + бейдж "Хит"
// - children: описание + цена (оригинальная зачёркнута + скидка)
// - footer: две кнопки — "В корзину" и "Купить сейчас"

export function Task1_1() {
  const { t } = useLanguage()

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100%' }}>
      <h2 style={{ marginTop: 0, marginBottom: 24 }}>{t('task.title')} 1.1</h2>

      {/* TODO 6: Отрендерите три карточки рядом */}
      {/* Используйте CSS Grid: display: grid, gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 */}
      <div>
        {/* <ProfileCard /> */}
        {/* <NotificationCard /> */}
        {/* <ProductCard /> */}
      </div>
    </div>
  )
}
