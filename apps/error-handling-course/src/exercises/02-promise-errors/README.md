# 🔥 Уровень 2: Ошибки в Promise

## 🎯 Введение

Асинхронный код — сердце JavaScript. Запросы к серверу, таймеры, файловые операции — всё это асинхронно. И ошибки в асинхронном коде ведут себя иначе, чем в синхронном.

На этом уровне мы разберём, как ошибки работают с Promise API: `.then/.catch`, цепочки промисов и Promise-комбинаторы.

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

## ⚠️ Частые ошибки новичков

### 🐛 1. Необработанное отклонение промиса

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

### 🐛 2. Использование Promise.all без учёта частичных результатов

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
- 💡 `Promise.allSettled` — когда нужны результаты всех операций
- 💡 `Promise.any` + `AggregateError` — первый успешный из нескольких
- 🔥 `Promise.race` — полезен для реализации таймаутов
- ⚠️ Всегда обрабатывайте отклонённые промисы через `.catch()` или `try/catch`
