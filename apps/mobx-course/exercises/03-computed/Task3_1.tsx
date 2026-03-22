import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.1: Первый computed
// Task 3.1: First Computed
// ============================================

// TODO: Создайте CartStore с:
//   - items: {name, price, qty}[]
//   - computed геттер totalPrice
//   - методы setQty, addItem, removeItem

export function Task3_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.1: First Computed</h2>
      {/* TODO: таблица товаров + итоговая сумма */}
    </div>
  )
}
