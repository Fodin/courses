# 🔥 Уровень 7: Глобальная обработка ошибок

## Введение

Не все ошибки можно поймать в `try/catch`. Ошибки в `setTimeout`, необработанные промисы, ошибки в сторонних библиотеках — всё это требует глобальной обработки.

🎯 **Цель уровня:** научиться перехватывать «упущенные» ошибки на глобальном уровне, централизованно логировать их и настраивать мониторинг.

## 🔥 window.onerror и error event

### Глобальный обработчик ошибок

```javascript
window.addEventListener('error', (event) => {
  console.log('Ошибка:', event.message)
  console.log('Файл:', event.filename)
  console.log('Строка:', event.lineno, 'Колонка:', event.colno)
  console.log('Error:', event.error)
})
```

### Unhandled Promise Rejection

```javascript
window.addEventListener('unhandledrejection', (event) => {
  console.log('Необработанный промис:', event.reason)
  event.preventDefault() // Предотвратить вывод в консоль
})
```

### Что ловят глобальные обработчики

| Источник | `error` event | `unhandledrejection` |
|----------|:---:|:---:|
| `throw` в setTimeout | ✅ | ❌ |
| Promise.reject без catch | ❌ | ✅ |
| Ошибка загрузки ресурса | ✅ | ❌ |
| Синтаксическая ошибка | ✅ | ❌ |

## 🔥 Сервис логирования

```typescript
interface LogEntry {
  level: 'error' | 'warn' | 'info'
  message: string
  timestamp: Date
  context?: Record<string, unknown>
  stack?: string
}

class ErrorLogger {
  private logs: LogEntry[] = []

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.addLog({
      level: 'error',
      message,
      timestamp: new Date(),
      context,
      stack: error?.stack,
    })
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.addLog({ level: 'warn', message, timestamp: new Date(), context })
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry)
    // В продакшене: отправить на сервер
    this.sendToServer(entry)
  }

  private async sendToServer(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        body: JSON.stringify(entry),
      })
    } catch {
      // Не бросать ошибку в логгере!
    }
  }
}
```

📌 **Важно:** логгер никогда не должен бросать ошибки сам — иначе можно уйти в бесконечный цикл логирования.

## 🔥 React Error Context

Централизованная обработка ошибок через Context API:

```typescript
interface ErrorContextValue {
  errors: Array<{ id: number; message: string; severity: 'error' | 'warning' }>
  addError: (message: string, severity?: 'error' | 'warning') => void
  removeError: (id: number) => void
  clearErrors: () => void
}

const ErrorContext = createContext<ErrorContextValue | null>(null)
```

### Провайдер

```typescript
function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<ErrorContextValue['errors']>([])

  const addError = useCallback((message: string, severity = 'error') => {
    const id = Date.now()
    setErrors(prev => [...prev, { id, message, severity }])

    // Auto-dismiss warnings
    if (severity === 'warning') {
      setTimeout(() => removeError(id), 5000)
    }
  }, [])

  // ...

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  )
}
```

### Использование в компонентах

```typescript
function SaveButton() {
  const { addError } = useErrorContext()

  const handleSave = async () => {
    try {
      await saveData()
    } catch (error) {
      addError(error instanceof Error ? error.message : 'Ошибка сохранения')
    }
  }

  return <button onClick={handleSave}>Сохранить</button>
}
```

## 🔥 Мониторинг ошибок

### Структура отчёта

```typescript
interface ErrorReport {
  message: string
  stack?: string
  url: string
  timestamp: Date
  userAgent: string
  extra?: Record<string, unknown>
}
```

### Сервисы мониторинга

В продакшене используются сервисы вроде Sentry, Bugsnag, LogRocket:

```typescript
// Пример интеграции с Sentry
import * as Sentry from '@sentry/react'

Sentry.init({ dsn: 'https://...' })

// Ручной репорт
Sentry.captureException(error, {
  extra: { userId: '123', action: 'checkout' }
})
```

## ⚠️ Частые ошибки новичков

### 1. ❌ Глобальный обработчик как замена локальному try/catch

```javascript
// ❌ Плохо — полагаться только на глобальный обработчик
window.addEventListener('error', (event) => {
  showToast(event.message)
})

// А в коде компонента — никакой обработки:
function loadUser() {
  const data = JSON.parse(localStorage.getItem('user'))
  return data
}
```

Глобальный обработчик не знает контекст ошибки — он не может показать ошибку рядом с нужным полем, предложить retry или откатить операцию. Пользователь увидит общий toast вместо понятного действия. Глобальный обработчик — это **страховочная сетка**, а не основная стратегия.

```javascript
// ✅ Хорошо — локальная обработка + глобальный обработчик как fallback
function loadUser() {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    console.error('Corrupted user data in localStorage:', error)
    return null
  }
}
```

### 2. ❌ Бросание ошибок внутри логгера

```typescript
// ❌ Плохо — логгер бросает ошибку при сбое отправки
private async sendToServer(entry: LogEntry) {
  const response = await fetch('/api/logs', {
    method: 'POST',
    body: JSON.stringify(entry),
  })
  if (!response.ok) {
    throw new Error('Failed to send log') // 🐛 Это вызовет новое логирование!
  }
}
```

Если логгер бросает ошибку, глобальный обработчик поймает её и вызовет логгер снова. Результат — бесконечный цикл, переполнение стека или DDoS на свой же сервер логов.

```typescript
// ✅ Хорошо — логгер тихо проглатывает свои ошибки
private async sendToServer(entry: LogEntry) {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
  } catch {
    // Молча игнорируем — логгер не должен создавать новых ошибок
  }
}
```

### 3. ❌ Использование `Date.now()` как уникального ID ошибки

```typescript
// ❌ Плохо — два вызова в одну миллисекунду дадут одинаковый id
const addError = (message: string) => {
  const id = Date.now()
  setErrors(prev => [...prev, { id, message }])
}
```

При быстром добавлении нескольких ошибок (например, при submit формы с множеством невалидных полей) id окажутся одинаковыми. Удаление одной ошибки по id удалит не ту или не все.

```typescript
// ✅ Хорошо — инкрементальный счётчик гарантирует уникальность
let nextId = 0
const addError = (message: string) => {
  const id = ++nextId
  setErrors(prev => [...prev, { id, message }])
}
```

### 4. ❌ Забыть подписаться на `unhandledrejection`

```javascript
// ❌ Плохо — ловим только синхронные ошибки
window.addEventListener('error', (event) => {
  logger.error(event.message, event.error)
})
// Необработанные промисы — полностью невидимы!
```

Без обработчика `unhandledrejection` забытый `.catch()` у промиса останется полностью незамеченным. Ошибка произойдёт, но ни логгер, ни мониторинг о ней не узнают.

```javascript
// ✅ Хорошо — ловим и синхронные ошибки, и промисы
window.addEventListener('error', (event) => {
  logger.error(event.message, event.error)
})
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled rejection', event.reason)
})
```

## 📌 Итоги

- ✅ `window.addEventListener('error')` ловит глобальные синхронные ошибки
- ✅ `unhandledrejection` ловит необработанные промисы — **не забывайте про него!**
- ✅ Сервис логирования централизует сбор ошибок
- ✅ React Error Context — удобный способ показывать ошибки пользователю
- ✅ В продакшене используйте Sentry или аналоги для мониторинга
- ⚠️ Глобальные обработчики — это страховочная сетка, а не замена локальной обработке
- ⚠️ Логгер никогда не должен бросать ошибки
