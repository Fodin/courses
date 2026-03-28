# 🔥 Уровень 3: async/await и обработка ошибок

## 🎯 Введение

`async/await` позволяет писать асинхронный код так, как будто он синхронный. А обработка ошибок через `try/catch` становится естественной и понятной. На этом уровне мы также разберём retry-паттерн для автоматических повторных попыток.

## 🔥 async/await и try/catch

`async/await` позволяет обрабатывать асинхронные ошибки так же, как синхронные:

```typescript
async function loadUser(id: number) {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      console.error('Не удалось загрузить:', error.message)
    }
    throw error // Пробрасываем дальше
  } finally {
    console.log('Запрос завершён')
  }
}
```

### Последовательные запросы

Если один из последовательных `await` упадёт, остальные не выполнятся:

```typescript
async function loadDashboard() {
  try {
    const user = await fetchUser()     // ✅
    const posts = await fetchPosts()   // ❌ Ошибка!
    const stats = await fetchStats()   // ⛔ Не выполнится
    return { user, posts, stats }
  } catch (error) {
    // Обработка
  }
}
```

## 🎯 Retry паттерн

Повторные попытки при ошибке:

```typescript
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delay: number
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }

  throw lastError
}

// Использование
const data = await retry(() => fetch('/api/data'), 3, 1000)
```

### Экспоненциальная задержка

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number
): Promise<T> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts - 1) throw error
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Unreachable')
}
```

## ⚠️ Частые ошибки новичков

### 🐛 1. Забытый await

```typescript
// ❌ Плохо
try {
  fetchData() // Промис не awaited — catch не поймает!
} catch (error) {
  // Этот catch не сработает для промиса
}
```

> **Почему это ошибка:** без `await` функция `fetchData()` возвращает промис, но `try/catch` работает только с синхронными исключениями. Промис отклонится «в фоне», `catch` ничего не поймает, и вы получите `UnhandledPromiseRejection`. Ошибка произойдёт, но обработчик никогда не узнает о ней.

```typescript
// ✅ Хорошо
try {
  await fetchData()
} catch (error) {
  // Теперь поймает
}
```

### 🐛 2. Тихое поглощение ошибки с return null

```typescript
// ❌ Плохо — вызывающий код не узнает об ошибке
async function loadData() {
  try {
    return await fetch('/api')
  } catch (error) {
    console.log('ошибка')
    return null // Тихо возвращаем null
  }
}
```

> **Почему это ошибка:** вызывающий код получает `null` и не может отличить «данных нет» от «произошла сетевая ошибка». Это приводит к каскаду проблем: `Cannot read properties of null` в компонентах, неверное состояние UI, невозможность показать пользователю адекватное сообщение. Решение о том, как обработать ошибку, должен принимать вызывающий код.

```typescript
// ✅ Хорошо — даём вызывающему коду решать
async function loadData() {
  try {
    return await fetch('/api')
  } catch (error) {
    console.error('loadData failed:', error)
    throw error
  }
}
```

## 📌 Итоги

- ✅ `try/catch` + `await` — основной паттерн для async/await
- ✅ `finally` выполняется всегда — удобно для cleanup
- 🔥 `retry` — автоматические повторные попытки при сбоях
- 💡 Экспоненциальная задержка снижает нагрузку на сервер
- ⚠️ Всегда ставьте `await` в `try/catch` — без него catch не работает
- ⚠️ Не поглощайте ошибки тихо — пробрасывайте или явно обрабатывайте
