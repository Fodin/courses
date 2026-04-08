import { useState, ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.1: Layout-компоненты с навигацией
// ============================================
//
// Реализуйте три layout-компонента:
//   RootLayout  — корневая обёртка с шапкой и навигацией
//   SidebarLayout — двухколоночный layout (сайдбар + контент)
//   CenteredLayout — центрирующая обёртка с maxWidth
//
// Layout-компоненты знают ГДЕ разместить контент,
// но не знают ЧТО это за контент.
//
// Навигация: три "страницы" через useState (имитирует React Router):
//   - Dashboard → использует SidebarLayout
//   - Profile   → использует CenteredLayout
//   - Settings  → использует CenteredLayout

// TODO: Реализуйте RootLayout
// Принимает: children, currentPage, onNavigate
// Отображает шапку с кнопками навигации + children

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
//         {/* Навигационные кнопки: Dashboard, Профиль, Настройки */}
//       </header>
//       <div>{children}</div>
//     </div>
//   )
// }

// TODO: Реализуйте SidebarLayout
// Принимает: sidebar, children, sidebarWidth (default 220)
// Flexbox: aside фиксированной ширины + main с flex: 1 и minWidth: 0

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
// Принимает: children, maxWidth (default 720)
// Центрирует через margin: '0 auto' + padding по бокам

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
//   DashboardPage — контент + боковое меню (использует SidebarLayout)
//   ProfilePage   — форма профиля (использует CenteredLayout)
//   SettingsPage  — настройки (использует CenteredLayout)

export function Task10_1() {
  const { t } = useLanguage()

  // TODO: добавьте state для currentPage
  // const [currentPage, setCurrentPage] = useState('dashboard')

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 10.1</h2>

      {/* TODO: Оберните в RootLayout и рендерите нужную страницу */}
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
