import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.1: Document Metadata
// Task 7.1: Document Metadata
// ============================================

// TODO: Создайте компонент страницы, который рендерит
// <title> и <meta> теги прямо внутри компонента
// TODO: Create a page component that renders
// <title> and <meta> tags directly inside the component

export function Task7_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.1</h2>

      {/* TODO: Добавьте <title> для страницы */}
      {/* TODO: Добавьте <meta name="description"> */}
      {/* TODO: Добавьте <meta name="keywords"> */}
    </div>
  )
}
