import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.4: Suspense + use + ErrorBoundary
// ============================================

// TODO: Создайте полный паттерн загрузки данных
// TODO: Suspense для loading, ErrorBoundary для ошибок, use() для данных

export function Task2_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.4</h2>

      {/* TODO: ErrorBoundary + Suspense + use(promise) */}
    </div>
  )
}
