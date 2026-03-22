import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.3: Типы observable
// Task 1.3: Observable Types
// ============================================

// TODO: Создайте CollectionStore с:
//   - items: string[] (массив)
//   - tags: Map<string, string>
//   - selectedIds: Set<number>
//   - методы для добавления/удаления из каждой коллекции
//   - computed summary

export function Task1_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 1.3: Observable Types</h2>
      {/* TODO: отобразите все три коллекции с кнопками управления */}
    </div>
  )
}
