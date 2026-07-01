import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.4: observable.ref
// Task 1.4: observable.ref
// ============================================

// TODO: Создайте DataStore с:
//   - items: DataItem[] помеченный как observable.ref
//   - метод setItems (замена массива целиком)
//   - computed sortedItems
// ПОДСКАЗКА: при observable.ref нельзя мутировать массив (push/splice),
// нужно заменять его целиком через setItems([...])

export function Task1_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 1.4: observable.ref</h2>
      {/* TODO: список элементов + кнопки Add/Remove */}
    </div>
  )
}
