import { useState, ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.1: Layout-компоненты с навигацией
// Task 10.1: Layout components with navigation
// ============================================
//
// Реализуйте три layout-компонента:
// Implement three layout components:
//   RootLayout  — корневая обёртка с шапкой и навигацией
//   RootLayout  — root wrapper with header and navigation
//   SidebarLayout — двухколоночный layout (сайдбар + контент)
//   SidebarLayout — two-column layout (sidebar + content)
//   CenteredLayout — центрирующая обёртка с maxWidth
//   CenteredLayout — centering wrapper with maxWidth
//
// Layout-компоненты знают ГДЕ разместить контент,
// Layout components know WHERE to place content,
// но не знают ЧТО это за контент.
// but don't know WHAT that content is.
//
// Навигация: три "страницы" через useState (имитирует React Router):
// Navigation: three "pages" via useState (simulating React Router):
//   - Dashboard → использует SidebarLayout
//   - Dashboard → uses SidebarLayout
//   - Profile   → использует CenteredLayout
//   - Profile   → uses CenteredLayout
//   - Settings  → использует CenteredLayout
//   - Settings  → uses CenteredLayout

// TODO: Реализуйте RootLayout
// TODO: Implement RootLayout
// Принимает: children, currentPage, onNavigate
// Accepts: children, currentPage, onNavigate
// Отображает шапку с кнопками навигации + children
// Displays header with navigation buttons + children

// TODO: interface RootLayoutProps {
//   children: ReactNode
//   currentPage: string
//   onNavigate: (page: string) => void
// }

// TODO: function RootLayout({ children, currentPage, onNavigate }: RootLayoutProps) {
//   return (
//     <div style={{ ... }}>
//       <header>
//         {/* Логотип */}
//         {/* Logo */}
//         {/* Навигационные кнопки: Dashboard, Профиль, Настройки */}
//         {/* Navigation buttons: Dashboard, Profile, Settings */}
//       </header>
//       <div>{children}</div>
//     </div>
//   )
// }

// TODO: Реализуйте SidebarLayout
// TODO: Implement SidebarLayout
// Принимает: sidebar, children, sidebarWidth (default 220)
// Accepts: sidebar, children, sidebarWidth (default 220)
// Flexbox: aside фиксированной ширины + main с flex: 1 и minWidth: 0
// Flexbox: aside with fixed width + main with flex: 1 and minWidth: 0

// TODO: interface SidebarLayoutProps {
//   sidebar: ReactNode
//   children: ReactNode
//   sidebarWidth?: number
// }

// TODO: function SidebarLayout({ sidebar, children, sidebarWidth = 220 }: SidebarLayoutProps) {
//   return (
//     <div style={{ display: 'flex' }}>
//       <aside style={{ width: sidebarWidth, flexShrink: 0 }}>{sidebar}</aside>
//       <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
//     </div>
//   )
// }

// TODO: Реализуйте CenteredLayout
// TODO: Implement CenteredLayout
// Принимает: children, maxWidth (default 720)
// Accepts: children, maxWidth (default 720)
// Центрирует через margin: '0 auto' + padding по бокам
// Centers via margin: '0 auto' + padding on sides

// TODO: interface CenteredLayoutProps {
//   children: ReactNode
//   maxWidth?: number
// }

// TODO: function CenteredLayout({ children, maxWidth = 720 }: CenteredLayoutProps) {
//   return (
//     <div style={{ padding: '1.5rem' }}>
//       <div style={{ maxWidth, margin: '0 auto' }}>{children}</div>
//     </div>
//   )
// }

// TODO: Создайте "страницы" — простые компоненты-заглушки:
// TODO: Create "pages" — simple placeholder components:
//   DashboardPage — контент + боковое меню (использует SidebarLayout)
//   DashboardPage — content + sidebar menu (uses SidebarLayout)
//   ProfilePage   — форма профиля (использует CenteredLayout)
//   ProfilePage   — profile form (uses CenteredLayout)
//   SettingsPage  — настройки (использует CenteredLayout)
//   SettingsPage  — settings (uses CenteredLayout)

export function Task10_1() {
  const { t } = useLanguage()

  // TODO: добавьте state для currentPage
  // TODO: add state for currentPage
  // const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 10.1</h2>

      {/* TODO: Оберните в RootLayout и рендерите нужную страницу */}
      {/* TODO: Wrap in RootLayout and render the appropriate page */}
      {/* <RootLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'dashboard' && (
          <SidebarLayout sidebar={<DashboardSidebar />}>
            <DashboardContent />
          </SidebarLayout>
        )}
        {currentPage === 'profile' && (
          <CenteredLayout>
            <ProfilePage />
          </CenteredLayout>
        )}
        {currentPage === 'settings' && (
          <CenteredLayout maxWidth={480}>
            <SettingsPage />
          </CenteredLayout>
        )}
      </RootLayout> */}
    </div>
  )
}
