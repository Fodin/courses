import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.1: useAsync → useApi → UserSearch
// ============================================
//
// Реализуйте цепочку хуков для загрузки данных:
// 1. useAsync<T> — базовый хук с loading/data/error
// 2. useApi<T>  — добавляет AbortController для отмены запросов
// 3. UserSearch — компонент, который только рендерит
//
// API для демо: https://jsonplaceholder.typicode.com/users

// TODO: Определите тип AsyncState<T>
// interface AsyncState<T> {
//   loading: boolean
//   data: T | null
//   error: string | null
// }

// TODO: Реализуйте useAsync<T>(fn, deps)
// - Запускает fn() при монтировании и при изменении deps
// - Защита от race condition: let cancelled = false
//   → в .then()/.catch() проверять if (!cancelled)
//   → в cleanup: return () => { cancelled = true }
// - Обновляет все три поля атомарно через setState({ loading, data, error })
// function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList): AsyncState<T> {
//   ...
// }

// TODO: Реализуйте useApi<T>(url: string)
// - Создайте AbortController в useRef
// - Перед новым запросом вызывайте abortRef.current?.abort()
// - Передавайте signal: abortRef.current.signal в fetch
// - Игнорируйте AbortError: if (err.name === 'AbortError') return
// - Верните AsyncState<T> + функцию refetch
// function useApi<T>(url: string): AsyncState<T> & { refetch: () => void } {
//   ...
// }

// Тип пользователя (JSONPlaceholder)
// interface User {
//   id: number
//   name: string
//   email: string
//   company: { name: string }
// }

export function Task7_1() {
  const { t } = useLanguage()

  // TODO: Используйте useApi для загрузки пользователей
  // const { loading, data: users, error, refetch } = useApi<User[]>(
  //   'https://jsonplaceholder.typicode.com/users'
  // )

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.1</h2>

      {/* TODO: Добавьте поле поиска */}

      {/* TODO: Покажите индикатор загрузки */}

      {/* TODO: Покажите сообщение об ошибке */}

      {/* TODO: Отрендерите список пользователей */}
      {/* Каждый элемент: аватар (первая буква имени), имя, email */}
    </div>
  )
}
