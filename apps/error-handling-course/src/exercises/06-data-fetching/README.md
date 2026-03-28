# 🔥 Уровень 6: Обработка ошибок при загрузке данных

## 🎯 Введение

Загрузка данных — один из главных источников ошибок в веб-приложениях. Сеть ненадёжна, серверы падают, API меняются. Правильная обработка ошибок при data fetching критически важна для UX.

## ⚠️ Особенности fetch API

### 🐛 fetch НЕ кидает ошибку при HTTP 4xx/5xx!

Это самая частая ловушка:

```javascript
// ❌ fetch кидает ошибку ТОЛЬКО при сетевой проблеме
// HTTP 404, 500 и т.д. — НЕ являются ошибкой для fetch!

const response = await fetch('/api/users/999')
console.log(response.ok)     // false
console.log(response.status) // 404
// Но ошибки не было! Промис зарезолвился успешно
```

> Почему это ловушка: разработчики из других языков/библиотек (axios, jQuery) привыкли, что HTTP-ошибки кидают исключение. С `fetch` код продолжает выполняться, как будто всё в порядке, — и позже падает при попытке обработать несуществующие данные.

### ✅ Правильный паттерн

```typescript
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}
```

### 📌 Типы ошибок fetch

| Ситуация | Тип ошибки | `response.ok` |
|----------|-----------|---------------|
| Нет сети | `TypeError` | N/A (промис отклонён) |
| DNS не найден | `TypeError` | N/A |
| Таймаут (AbortController) | `AbortError` | N/A |
| HTTP 404 | ⚠️ Нет ошибки | `false` |
| HTTP 500 | ⚠️ Нет ошибки | `false` |
| Некорректный JSON | `SyntaxError` | `true` |

## 🔥 Класс ApiError

```typescript
class ApiError extends Error {
  status: number
  code: string
  details?: Record<string, unknown>

  constructor(status: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

async function apiCall<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      body.code ?? 'UNKNOWN',
      body.message ?? response.statusText,
      body.details
    )
  }

  return response.json()
}
```

## 🔥 Паттерн Loading/Error/Success

### Типизация состояния

```typescript
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

### 💡 Хук useFetch

```typescript
function useFetch<T>(fetchFn: () => Promise<T>) {
  const [state, setState] = useState<FetchState<T>>({ status: 'idle' })

  const execute = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const data = await fetchFn()
      setState({ status: 'success', data })
    } catch (error) {
      setState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      })
    }
  }, [fetchFn])

  return { state, execute }
}
```

### Использование в компоненте

```tsx
function UserList() {
  const { state, execute } = useFetch(fetchUsers)

  useEffect(() => { execute() }, [execute])

  switch (state.status) {
    case 'idle':
    case 'loading':
      return <Spinner />
    case 'error':
      return (
        <ErrorMessage
          message={state.error}
          onRetry={execute}
        />
      )
    case 'success':
      return <UserTable users={state.data} />
  }
}
```

## 💡 Retry при загрузке

```typescript
async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetchFn()
    } catch (error) {
      if (attempt === maxRetries) throw error

      // ⚠️ Не повторять при клиентских ошибках (4xx)
      if (error instanceof ApiError && error.status < 500) throw error

      await new Promise(r => setTimeout(r, delay * attempt))
    }
  }
  throw new Error('Unreachable')
}
```

## 🔥 AbortController для отмены

```typescript
function useAbortableFetch<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({ status: 'idle' })

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setState({ status: 'loading' })
      try {
        const res = await fetch(url, { signal: controller.signal })
        const data = await res.json()
        setState({ status: 'success', data })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return // Запрос отменён — ничего не делаем
        }
        setState({
          status: 'error',
          error: error instanceof Error ? error.message : 'Ошибка',
        })
      }
    }

    load()
    return () => controller.abort()
  }, [url])

  return state
}
```

## ⚠️ Частые ошибки новичков

### ❌ Не проверять `response.ok`

```typescript
// ❌ Плохо: fetch резолвится даже при 404/500
async function getUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  const data = await response.json() // 💥 Может вернуть HTML-страницу ошибки!
  return data
}
```

> Почему это ошибка: при HTTP 404 или 500 `fetch` **не** кидает исключение. Промис успешно резолвится, и `response.json()` попытается распарсить HTML-страницу ошибки сервера как JSON — получите `SyntaxError`. А если сервер вернёт JSON с ошибкой, код будет работать с данными ошибки как с валидными данными.

```typescript
// ✅ Хорошо: проверяем статус ответа
async function getUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_ERROR', response.statusText)
  }
  return response.json()
}
```

### ❌ Retry для клиентских ошибок (4xx)

```typescript
// ❌ Плохо: бесконечно повторяем запрос, который никогда не сработает
async function fetchWithBadRetry<T>(url: string): Promise<T> {
  for (let i = 0; i < 3; i++) {
    try {
      return await apiCall<T>(url)
    } catch {
      await new Promise(r => setTimeout(r, 1000))
      // Повторяем ВСЕ ошибки, включая 400, 401, 404...
    }
  }
  throw new Error('Failed')
}
```

> Почему это ошибка: ошибки 4xx — это клиентские ошибки (неверный запрос, нет авторизации, ресурс не найден). Повторный запрос **ничего не изменит** — сервер ответит тем же. Вы тратите время пользователя и нагружаете сервер бессмысленными запросами.

```typescript
// ✅ Хорошо: повторяем только серверные ошибки (5xx) и сетевые
async function fetchWithSmartRetry<T>(url: string): Promise<T> {
  for (let i = 0; i < 3; i++) {
    try {
      return await apiCall<T>(url)
    } catch (error) {
      if (error instanceof ApiError && error.status < 500) throw error // 4xx — не повторяем
      if (i === 2) throw error
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw new Error('Failed')
}
```

### ❌ Забыть обработать `AbortError` при отмене

```typescript
// ❌ Плохо: AbortError устанавливает состояние ошибки
useEffect(() => {
  const controller = new AbortController()
  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setState({ status: 'success', data }))
    .catch(error => {
      // 💥 При размонтировании setState вызовется на размонтированном компоненте
      setState({ status: 'error', error: error.message })
    })
  return () => controller.abort()
}, [url])
```

> Почему это ошибка: при размонтировании компонента `controller.abort()` вызовет `AbortError`. Без фильтрации этой ошибки вы получите: 1) ложное состояние ошибки 2) предупреждение React о вызове setState на размонтированном компоненте 3) мелькание ошибки в UI при быстрой навигации.

```typescript
// ✅ Хорошо: фильтруем AbortError
useEffect(() => {
  const controller = new AbortController()
  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setState({ status: 'success', data }))
    .catch(error => {
      if (error.name === 'AbortError') return // Отмена — не ошибка
      setState({ status: 'error', error: error.message })
    })
  return () => controller.abort()
}, [url])
```

## 📌 Итоги

- ⚠️ `fetch` не кидает ошибку при HTTP 4xx/5xx — проверяйте `response.ok`
- ✅ Создавайте `ApiError` с кодом и деталями для типизированной обработки
- ✅ Используйте discriminated union `FetchState<T>` для моделирования состояний
- ✅ Повторяйте только серверные ошибки (5xx), не клиентские (4xx)
- ✅ Используйте `AbortController` для отмены запросов при размонтировании
- 💡 Всегда фильтруйте `AbortError` при использовании `AbortController`
