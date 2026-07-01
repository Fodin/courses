import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.1: Обновление до React 19
// Task 0.1: Upgrading to React 19
// ============================================

// TODO: Создайте компонент, показывающий "до" и "после" обновления package.json
// TODO: Create a component showing "before" and "after" of package.json upgrade

// TODO: Покажите какие пакеты нужно обновить (react, react-dom, @types/react, @types/react-dom)
// TODO: Show which packages need to be updated

export function Task0_1() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 0.1</h2>

      {/* TODO: Создайте две секции: "До обновления" и "После обновления" */}
      {/* TODO: Create two sections: "Before upgrade" and "After upgrade" */}

      {/* TODO: Покажите diff пакетов */}
      {/* TODO: Show package diff */}
    </div>
  )
}
