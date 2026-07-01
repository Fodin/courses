import { useLanguage } from 'src/hooks'

// ============================================
// Task 6.2: Notification System
// Задание 6.2: Система нотификаций
// ============================================
//
// Implement toast notifications with queue, auto-dismiss and types.
//
// Реализуйте toast-нотификации с очередью, auto-dismiss и типами.
//
// Key techniques:
// - Timers in useRef<Map<string, ReturnType<typeof setTimeout>>>
// - useCallback for stable notify and dismiss functions
// - useEffect cleanup to clear all timers on unmount
//
// Ключевые приёмы:
// - Таймеры в useRef<Map<string, ReturnType<typeof setTimeout>>>
// - useCallback для стабильных функций notify и dismiss
// - useEffect cleanup для очистки всех таймеров

// TODO: Define types
// TODO: Определите типы
// interface Notification { id, message, type: 'info'|'success'|'warning'|'error', duration }
// interface NotificationContextValue { notify, dismiss }

// TODO: Create NotificationContext
// TODO: Создайте NotificationContext
// const NotificationContext = createContext<NotificationContextValue | null>(null)

// TODO: Implement useNotifications() hook with null check
// TODO: Реализуйте хук useNotifications() с проверкой на null

// TODO: Implement NotificationProvider
// TODO: Реализуйте NotificationProvider
// - state: array of active notifications
// - state: массив активных нотификаций
// - timersRef: Map for storing auto-dismiss timers
// - timersRef: Map для хранения таймеров auto-dismiss
// - dismiss: removes notification and clears its timer
// - dismiss: удаляет нотификацию и очищает её таймер
// - notify: adds a notification, starts timer if duration > 0
// - notify: добавляет нотификацию, запускает таймер если duration > 0
// - useEffect: clears all timers on unmount
// - useEffect: очищает все таймеры при размонтировании
// - renders NotificationContainer directly inside Provider
// - рендерит NotificationContainer прямо внутри Provider

// TODO: Implement NotificationContainer({ notifications, onDismiss })
// TODO: Реализуйте NotificationContainer({ notifications, onDismiss })
// Fixed container in the top-right corner (position: fixed, top: 16, right: 16)
// Фиксированный контейнер в правом верхнем углу (position: fixed, top: 16, right: 16)
// Each type has its own color:
// Каждый тип имеет свой цвет:
//   info: blue (#1976d2), success: green (#388e3c),
//   info: синий (#1976d2), success: зелёный (#388e3c),
//   warning: yellow (#f57f17), error: red (#c62828)
//   warning: жёлтый (#f57f17), error: красный (#c62828)

// TODO: Implement demo component using useNotifications()
// TODO: Реализуйте демо-компонент, использующий useNotifications()

export function Task6_2() {
  const { t } = useLanguage()
  return (
    // TODO: wrap in NotificationProvider
    // TODO: оберните в NotificationProvider
    <div className="exercise-container">
      <h2>{t('task.title')} 6.2</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        Notification system with auto-dismiss and queue
      </p>

      {/* TODO: place demo component with buttons for calling notify */}
      {/* TODO: разместите демо-компонент с кнопками для вызова notify */}
      {/* Buttons: Success (4s), Warning (4s), Error (6s), Info (4s), Permanent (duration=0) */}
      {/* Кнопки: Успех (4с), Предупреждение (4с), Ошибка (6с), Инфо (4с), Постоянная (duration=0) */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Here will be buttons for demonstrating notifications
      </div>
    </div>
  )
}
