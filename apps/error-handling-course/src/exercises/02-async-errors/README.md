# 🔥 Уровень 2: Асинхронные ошибки

## 🎯 Введение

Асинхронный код — сердце JavaScript. Запросы к серверу, таймеры, файловые операции — всё это асинхронно. И ошибки в асинхронном коде ведут себя иначе, чем в синхронном.

## 🔥 Promise и ошибки

### .then/.catch

```javascript
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Ошибка:', error))
```

### Ошибка в цепочке промисов

Если ошибка возникает в любом `.then`, она «проваливается» до ближайшего `.catch`:

```javascript
Promise.resolve('данные')
  .then(data => {
    throw new Error('Ошибка обработки')
  })
  .then(() => console.log('Не выполнится'))
  .catch(err => console.log('Поймано:', err.message))
  .then(() => console.log('Выполнится после catch'))
```

### Promise.reject

```javascript
const failed = Promise.reject(new Error('Ошибка'))
// Эквивалентно:
const also = new Promise((_, reject) => reject(new Error('Ошибка')))
```

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

## 📌 Promise комбинаторы

### Promise.all — «всё или ничего»

Отклоняется при первой ошибке:

```typescript
try {
  const [users, posts] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
  ])
} catch (error) {
  // ⚠️ Одна из операций упала — не знаем, которая
}
```

### Promise.allSettled — «получить все результаты»

Всегда выполняется успешно, возвращает статус каждого промиса:

```typescript
const results = await Promise.allSettled([
  fetchUsers(),
  fetchPosts(),
  fetchComments(),
])

for (const result of results) {
  if (result.status === 'fulfilled') {
    console.log('Данные:', result.value)
  } else {
    console.log('Ошибка:', result.reason.message)
  }
}
```

💡 Используйте `Promise.allSettled` когда нужно выполнить несколько независимых операций и получить результат каждой, даже если часть из них упала.

### Promise.race — «первый ответивший»

```typescript
const result = await Promise.race([
  fetchData(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Таймаут')), 5000)
  ),
])
```

### Promise.any — «первый успешный»

```typescript
try {
  const data = await Promise.any([
    fetchFromServer1(),
    fetchFromServer2(),
    fetchFromServer3(),
  ])
} catch (error) {
  // AggregateError — все промисы отклонены
  if (error instanceof AggregateError) {
    console.log('Все серверы недоступны:', error.errors)
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

### 🐛 2. Необработанное отклонение промиса

```javascript
// ❌ Плохо — необработанное отклонение
async function bad() {
  throw new Error('Ой')
}
bad() // UnhandledPromiseRejection!
```

> **Почему это ошибка:** если промис отклонён и нет обработчика `.catch()`, среда выполнения генерирует `unhandledrejection`. В Node.js это приводит к завершению процесса (начиная с Node 15+). В браузере — к ошибке в консоли и потенциально к непредсказуемому поведению приложения.

```javascript
// ✅ Хорошо
bad().catch(console.error)
```

### 🐛 3. Тихое поглощение ошибки с return null

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

### 🐛 4. Использование Promise.all без учёта частичных результатов

```typescript
// ❌ Плохо — один сбой теряет все результаты
try {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ])
} catch (error) {
  // Не знаем, что удалось, а что нет
  showError('Не удалось загрузить данные')
}
```

> **Почему это ошибка:** `Promise.all` отклоняется при первой ошибке, и вы теряете результаты остальных промисов, которые могли завершиться успешно. Если запросы независимы друг от друга — пользователь не увидит данные, которые реально загрузились.

```typescript
// ✅ Хорошо — используем allSettled для независимых запросов
const results = await Promise.allSettled([
  fetchUsers(),
  fetchPosts(),
  fetchComments(),
])
const [users, posts, comments] = results.map(r =>
  r.status === 'fulfilled' ? r.value : null
)
```

## 📌 Итоги

- ✅ `.catch()` ловит ошибки в цепочке промисов
- ✅ `try/catch` + `await` — основной паттерн для async/await
- 💡 `Promise.allSettled` — когда нужны результаты всех операций
- 💡 `Promise.any` + `AggregateError` — первый успешный из нескольких
- 🔥 `retry` — автоматические повторные попытки при сбоях
- ⚠️ Всегда ставьте `await` в `try/catch` — без него catch не работает
