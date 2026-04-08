import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 1.2 — PageLayout с четырьмя слотами
// ============================================
//
// Создайте компонент PageLayout с четырьмя слотами:
// header (обязательный), sidebar (опциональный),
// children (обязательный), footer (опциональный).
// Затем соберите из него полноценный Dashboard.
//
// Подробное описание: src/exercises/01-composition-basics/task-1.2.md

// TODO 1: Определите интерфейс PageLayoutProps
// - header: React.ReactNode — обязательный
// - sidebar?: React.ReactNode — необязательный
// - children: React.ReactNode — обязательный
// - footer?: React.ReactNode — необязательный

// TODO 2: Реализуйте компонент PageLayout
// Структура (используйте flexbox):
// - <div flexDirection: column, minHeight: 100vh>
//     <header> — полная ширина
//     <div display: flex, flex: 1>
//       {sidebar && <aside width: 220>}
//       <main flex: 1>
//     </div>
//     {footer && <footer>}
//   </div>

// TODO 3: Создайте компонент StatCard для карточек статистики
// Пропсы: label, value, change (строка типа "+8.2%")
// Если change начинается с "+" — цвет зелёный, иначе красный

// TODO 4: Создайте компонент DashboardPage
// Используйте PageLayout со всеми четырьмя слотами:
//
// header: логотип + имя приложения + аватар пользователя
//
// sidebar: список навигационных пунктов
//   ['Главная', 'Аналитика', 'Пользователи', 'Отчёты', 'Настройки']
//   Активный пункт выделяется цветом (useState для activeNav)
//
// children:
//   - Заголовок и подзаголовок
//   - Сетка из 3 StatCard (gridTemplateColumns: 'repeat(3, 1fr)')
//   - Блок "Последние события" со списком из 3 строк
//
// footer: строка с копирайтом

export function Task1_2() {
  const { t } = useLanguage()
  // Hint: используйте этот хук для активного пункта меню
  const [activeNav, setActiveNav] = useState('Главная')
  void activeNav
  void setActiveNav

  return (
    <div>
      <h2>{t('task.title')} 1.2</h2>
      {/* TODO 5: Замените этот div на <DashboardPage /> */}
    </div>
  )
}
