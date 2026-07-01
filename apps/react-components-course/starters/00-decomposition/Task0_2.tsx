import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.2: Container / Presentational разделение
// Task 0.2: Container / Presentational separation
// ============================================
// Разделите UserProfile на:
// Split UserProfile into:
// - UserProfileView (Dumb): только отображение, никакого state и fetch
// - UserProfileView (Dumb): display only, no state and fetch
// - UserProfileContainer (Smart): загрузка данных, управление loading/error
// - UserProfileContainer (Smart): data loading, managing loading/error

// TODO: Определите интерфейс User
// TODO: Define the User interface
// interface User {
//   id: string
//   name: string
//   email: string
//   role: string
//   avatar: string
//   isOnline: boolean
//   joinedAt: string
//   postsCount: number
//   followersCount: number
// }

// TODO: Создайте UserProfileView — Dumb компонент
// TODO: Create UserProfileView — Dumb component
// Принимает: user: User
// Accepts: user: User
// НЕ имеет: useState, useEffect, fetch
// Does NOT have: useState, useEffect, fetch
// Отображает: аватар (с индикатором онлайн), имя, роль, email, счётчики
// Displays: avatar (with online indicator), name, role, email, counters
// function UserProfileView({ user }: { user: User }) { ... }

// TODO: Создайте UserProfileContainer — Smart компонент
// TODO: Create UserProfileContainer — Smart component
// Принимает: userId: string
// Accepts: userId: string
// Хранит state: user, loading, error
// Stores state: user, loading, error
// Симулирует загрузку: setTimeout на 1 секунду, затем устанавливает user
// Simulates loading: setTimeout for 1 second, then sets user
// Показывает: индикатор загрузки, сообщение об ошибке, или UserProfileView
// Shows: loading indicator, error message, or UserProfileView
// Имеет кнопку "Перезагрузить" — сбрасывает state и запускает загрузку снова
// Has a "Reload" button — resets state and triggers loading again
// function UserProfileContainer({ userId }: { userId: string }) { ... }

// Моковые данные для имитации ответа сервера
// Mock data to simulate server response
const mockUserData = {
  id: 'u1',
  name: 'Екатерина Смирнова',
  email: 'e.smirnova@example.com',
  role: 'Senior Frontend Developer',
  avatar: 'https://placehold.co/80x80/e8eaf6/3f51b5?text=ES',
  isOnline: true,
  joinedAt: 'Март 2021',
  postsCount: 47,
  followersCount: 312,
}

export function Task0_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 0.2</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        {/* Разделите профиль пользователя: UserProfileContainer (данные) + UserProfileView (UI) */}
        {/* Split the user profile: UserProfileContainer (data) + UserProfileView (UI) */}
        Разделите профиль пользователя: UserProfileContainer (данные) + UserProfileView (UI)
      </p>

      {/* TODO: Отрендерите UserProfileContainer с userId="u1" */}
      {/* TODO: Render UserProfileContainer with userId="u1" */}
      {/* <UserProfileContainer userId="u1" /> */}

      {/* Временная заглушка — замените */}
      {/* Temporary placeholder — replace */}
      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь должен быть профиль пользователя с симуляцией загрузки
        <br />
        <small>Данные: {mockUserData.name} — {mockUserData.role}</small>
      </div>
    </div>
  )
}
