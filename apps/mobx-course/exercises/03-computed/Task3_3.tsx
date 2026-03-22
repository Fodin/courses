import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.3: Кеширование computed
// Task 3.3: Computed Caching
// ============================================

// TODO: Создайте ProductFilterStore с:
//   - products[], selectedCategory, minRating
//   - computed filteredAndSorted с console.log внутри
//   - счетчик computeCount
// Кнопка "Force re-render" не должна вызывать пересчет computed

export function Task3_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.3: Computed Caching</h2>
      {/* TODO: фильтры + список + кнопка Force re-render */}
    </div>
  )
}
