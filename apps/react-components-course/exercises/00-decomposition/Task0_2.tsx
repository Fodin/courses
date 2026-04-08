import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.2: Container / Presentational разделение
// ============================================
// Разделите UserProfile на:
// - UserProfileView (Dumb): только отображение, никакого state и fetch
// - UserProfileContainer (Smart): загрузка данных, управление loading/error

// TODO: Определите интерфейс User
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
// Принимает: user: User
// НЕ имеет: useState, useEffect, fetch
// Отображает: аватар (с индикатором онлайн), имя, роль, email, счётчики
// function UserProfileView({ user }: { user: User }) { ... }

// TODO: Создайте UserProfileContainer — Smart компонент
// Принимает: userId: string
// Хранит state: user, loading, error
// Симулирует загрузку: setTimeout на 1 секунду, затем устанавливает user
// Показывает: индикатор загрузки, сообщение об ошибке, или UserProfileView
// Имеет кнопку "Перезагрузить" — сбрасывает state и запускает загрузку снова
// function UserProfileContainer({ userId }: { userId: string }) { ... }

// Моковые данные для имитации ответа сервера
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
        Разделите профиль пользователя: UserProfileContainer (данные) + UserProfileView (UI)
      </p>

      {/* TODO: Отрендерите UserProfileContainer с userId="u1" */}
      {/* <UserProfileContainer userId="u1" /> */}

      {/* Временная заглушка — замените */}
      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь должен быть профиль пользователя с симуляцией загрузки
        <br />
        <small>Данные: {mockUserData.name} — {mockUserData.role}</small>
      </div>
    </div>
  )
}
