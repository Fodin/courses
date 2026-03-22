import { useLanguage } from 'src/hooks'

// ============================================
// Задание 2.1: use(Promise)
// ============================================

// TODO: Создайте промис, который загружает данные
// TODO: Используйте use() для чтения промиса
// TODO: Оберните компонент в Suspense

export function Task2_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 2.1</h2>

      {/* TODO: Создайте промис с данными */}
      {/* TODO: Используйте use(promise) для получения данных */}
      {/* TODO: Оберните в <Suspense fallback={...}> */}
    </div>
  )
}
