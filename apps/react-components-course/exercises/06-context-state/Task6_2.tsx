import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.2: Система нотификаций
// ============================================
//
// Реализуйте toast-нотификации с очередью, auto-dismiss и типами.
//
// Ключевые приёмы:
// - Таймеры в useRef<Map<string, ReturnType<typeof setTimeout>>>
// - useCallback для стабильных функций notify и dismiss
// - useEffect cleanup для очистки всех таймеров

// TODO: Определите типы
// interface Notification { id, message, type: 'info'|'success'|'warning'|'error', duration }
// interface NotificationContextValue { notify, dismiss }

// TODO: Создайте NotificationContext
// const NotificationContext = createContext<NotificationContextValue | null>(null)

// TODO: Реализуйте хук useNotifications() с проверкой на null

// TODO: Реализуйте NotificationProvider
// - state: массив активных нотификаций
// - timersRef: Map для хранения таймеров auto-dismiss
// - dismiss: удаляет нотификацию и очищает её таймер
// - notify: добавляет нотификацию, запускает таймер если duration > 0
// - useEffect: очищает все таймеры при размонтировании
// - рендерит NotificationContainer прямо внутри Provider

// TODO: Реализуйте NotificationContainer({ notifications, onDismiss })
// Фиксированный контейнер в правом верхнем углу (position: fixed, top: 16, right: 16)
// Каждый тип имеет свой цвет:
//   info: синий (#1976d2), success: зелёный (#388e3c),
//   warning: жёлтый (#f57f17), error: красный (#c62828)

// TODO: Реализуйте демо-компонент, использующий useNotifications()

export function Task6_2() {
  const { t } = useLanguage()
  return (
    // TODO: оберните в NotificationProvider
    <div className="exercise-container">
      <h2>{t('task.title')} 6.2</h2>
      <p style={{ color: '#888', fontStyle: 'italic' }}>
        Система нотификаций с auto-dismiss и очередью
      </p>

      {/* TODO: разместите демо-компонент с кнопками для вызова notify */}
      {/* Кнопки: Успех (4с), Предупреждение (4с), Ошибка (6с), Инфо (4с), Постоянная (duration=0) */}

      <div style={{ padding: '2rem', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center', color: '#999' }}>
        Здесь будут кнопки для демонстрации нотификаций
      </div>
    </div>
  )
}
