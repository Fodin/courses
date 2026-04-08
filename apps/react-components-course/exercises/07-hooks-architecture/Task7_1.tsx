import { useLanguage } from 'src/hooks'

// ============================================
// Task 7.1: useAsync → useApi → UserSearch
// Задание 7.1: useAsync → useApi → UserSearch
// ============================================
//
// Implement a chain of data loading hooks:
// 1. useAsync<T> — base hook with loading/data/error
// 2. useApi<T>  — adds AbortController for request cancellation
// 3. UserSearch — component that only renders
//
// Реализуйте цепочку хуков для загрузки данных:
// 1. useAsync<T> — базовый хук с loading/data/error
// 2. useApi<T>  — добавляет AbortController для отмены запросов
// 3. UserSearch — компонент, который только рендерит
//
// API for demo: https://jsonplaceholder.typicode.com/users
// API для демо: https://jsonplaceholder.typicode.com/users

// TODO: Define AsyncState<T> type
// TODO: Определите тип AsyncState<T>
// interface AsyncState<T> {
//   loading: boolean
//   data: T | null
//   error: string | null
// }

// TODO: Implement useAsync<T>(fn, deps)
// TODO: Реализуйте useAsync<T>(fn, deps)
// - Runs fn() on mount and when deps change
// - Запускает fn() при монтировании и при изменении deps
// - Race condition protection: let cancelled = false
// - Защита от race condition: let cancelled = false
//   → in .then()/.catch() check if (!cancelled)
//   → в .then()/.catch() проверять if (!cancelled)
//   → in cleanup: return () => { cancelled = true }
//   → в cleanup: return () => { cancelled = true }
// - Updates all three fields atomically via setState({ loading, data, error })
// - Обновляет все три поля атомарно через setState({ loading, data, error })
// function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList): AsyncState<T> {
//   ...
// }

// TODO: Implement useApi<T>(url: string)
// TODO: Реализуйте useApi<T>(url: string)
// - Create AbortController in useRef
// - Создайте AbortController в useRef
// - Before new request call abortRef.current?.abort()
// - Перед новым запросом вызывайте abortRef.current?.abort()
// - Pass signal: abortRef.current.signal to fetch
// - Передавайте signal: abortRef.current.signal в fetch
// - Ignore AbortError: if (err.name === 'AbortError') return
// - Игнорируйте AbortError: if (err.name === 'AbortError') return
// - Return AsyncState<T> + refetch function
// - Верните AsyncState<T> + функцию refetch
// function useApi<T>(url: string): AsyncState<T> & { refetch: () => void } {
//   ...
// }

// User type (JSONPlaceholder)
// Тип пользователя (JSONPlaceholder)
// interface User {
//   id: number
//   name: string
//   email: string
//   company: { name: string }
// }

export function Task7_1() {
  const { t } = useLanguage()

  // TODO: Use useApi for loading users
  // TODO: Используйте useApi для загрузки пользователей
  // const { loading, data: users, error, refetch } = useApi<User[]>(
  //   'https://jsonplaceholder.typicode.com/users'
  // )

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.1</h2>

      {/* TODO: Add search field */}
      {/* TODO: Добавьте поле поиска */}

      {/* TODO: Show loading indicator */}
      {/* TODO: Покажите индикатор загрузки */}

      {/* TODO: Show error message */}
      {/* TODO: Покажите сообщение об ошибке */}

      {/* TODO: Render user list */}
      {/* TODO: Отрендерите список пользователей */}
      {/* Each item: avatar (first letter of name), name, email */}
      {/* Каждый элемент: аватар (первая буква имени), имя, email */}
    </div>
  )
}
