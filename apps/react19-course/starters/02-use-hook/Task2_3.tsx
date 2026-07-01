import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.3: Условный use()
// ============================================

// TODO: Вызовите use() внутри условия if
// TODO: Это работает в отличие от useContext!

export function Task2_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.3</h2>

      {/* TODO: Покажите условный вызов use() */}
    </div>
  )
}
