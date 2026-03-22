import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.3: Preload API
// Task 7.3: Preload API
// ============================================

// TODO: Используйте preload и preinit из 'react-dom'
// для оптимизации загрузки ресурсов
// TODO: Use preload and preinit from 'react-dom'
// to optimize resource loading

export function Task7_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.3</h2>

      {/* TODO: Вызовите preinit() для критического CSS */}
      {/* TODO: Вызовите preload() для данных API */}
      {/* TODO: Покажите статус загрузки */}
    </div>
  )
}
