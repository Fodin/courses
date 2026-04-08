import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 1.2 — PageLayout с четырьмя слотами
// Task 1.2 — PageLayout with four slots
// ============================================
//
// Создайте компонент PageLayout с четырьмя слотами:
// Create a PageLayout component with four slots:
// header (обязательный), sidebar (опциональный),
// header (required), sidebar (optional),
// children (обязательный), footer (опциональный).
// children (required), footer (optional).
// Затем соберите из него полноценный Dashboard.
// Then build a full Dashboard from it.
//
// Подробное описание: src/exercises/01-composition-basics/task-1.2.md
// Detailed description: src/exercises/01-composition-basics/task-1.2.md

// TODO 1: Определите интерфейс PageLayoutProps
// TODO 1: Define the PageLayoutProps interface
// - header: React.ReactNode — обязательный
// - header: React.ReactNode — required
// - sidebar?: React.ReactNode — необязательный
// - sidebar?: React.ReactNode — optional
// - children: React.ReactNode — обязательный
// - children: React.ReactNode — required
// - footer?: React.ReactNode — необязательный
// - footer?: React.ReactNode — optional

// TODO 2: Реализуйте компонент PageLayout
// TODO 2: Implement the PageLayout component
// Структура (используйте flexbox):
// Structure (use flexbox):
// - <div flexDirection: column, minHeight: 100vh>
//     <header> — полная ширина
//     <header> — full width
//     <div display: flex, flex: 1>
//       {sidebar && <aside width: 220>}
//       <main flex: 1>
//     </div>
//     {footer && <footer>}
//   </div>

// TODO 3: Создайте компонент StatCard для карточек статистики
// TODO 3: Create the StatCard component for statistics cards
// Пропсы: label, value, change (строка типа "+8.2%")
// Props: label, value, change (string like "+8.2%")
// Если change начинается с "+" — цвет зелёный, иначе красный
// If change starts with "+" — green color, otherwise red

// TODO 4: Создайте компонент DashboardPage
// TODO 4: Create the DashboardPage component
// Используйте PageLayout со всеми четырьмя слотами:
// Use PageLayout with all four slots:
//
// header: логотип + имя приложения + аватар пользователя
// header: logo + app name + user avatar
//
// sidebar: список навигационных пунктов
// sidebar: list of navigation items
//   ['Главная', 'Аналитика', 'Пользователи', 'Отчёты', 'Настройки']
//   ['Home', 'Analytics', 'Users', 'Reports', 'Settings']
//   Активный пункт выделяется цветом (useState для activeNav)
//   Active item is highlighted by color (useState for activeNav)
//
// children:
// children:
//   - Заголовок и подзаголовок
//   - Title and subtitle
//   - Сетка из 3 StatCard (gridTemplateColumns: 'repeat(3, 1fr)')
//   - Grid of 3 StatCard (gridTemplateColumns: 'repeat(3, 1fr)')
//   - Блок "Последние события" со списком из 3 строк
//   - "Recent Events" block with a list of 3 rows
//
// footer: строка с копирайтом
// footer: copyright line

export function Task1_2() {
  const { t } = useLanguage()
  // Hint: используйте этот хук для активного пункта меню
  // Hint: use this hook for the active menu item
  const [activeNav, setActiveNav] = useState('Главная')
  void activeNav
  void setActiveNav

  return (
    <div>
      <h2>{t('task.title')} 1.2</h2>
      {/* TODO 5: Замените этот div на <DashboardPage /> */}
      {/* TODO 5: Replace this div with <DashboardPage /> */}
    </div>
  )
}
