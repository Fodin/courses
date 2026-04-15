# Уровень 11: Именование и стиль кода

## Код читают чаще, чем пишут

Исследования показывают: разработчики тратят до 70% времени на чтение кода — своего, коллег, библиотек. Соотношение «чтение : написание» — примерно 10:1.

Это значит: код, который легко читать — экономит деньги. Код, который тяжело читать — постоянно тратит когнитивную энергию команды.

```typescript
// Два одинаковых по функциональности варианта. Какой понятнее?

// Вариант A
function proc(d: any[], c: number): any[] {
  return d.filter(x => x.s === c && x.a === true)
}

// Вариант B
function getActiveOrdersByStatus(orders: Order[], status: OrderStatus): Order[] {
  return orders.filter(order => order.status === status && order.isActive)
}
```

Вариант B читается как предложение. Вариант A требует остановиться и расшифровать каждую букву.

---

## Именование переменных: существительные, отражающие содержимое

```typescript
// ❌ Плохо — отражает тип, а не смысл
const str = 'john@example.com'
const num = 42
const arr = ['Alice', 'Bob', 'Carol']
const obj = { id: 1, name: 'Alice' }

// ✅ Хорошо — отражает содержимое
const userEmail = 'john@example.com'
const maxRetries = 42
const adminNames = ['Alice', 'Bob', 'Carol']
const currentUser = { id: 1, name: 'Alice' }
```

---

## Именование функций: глаголы, описывающие действие

```typescript
// ❌ Существительные вместо глаголов
function emailValidation(email: string) { }
function userDataTransformation(user: User) { }

// ✅ Глаголы — функция что-то делает
function validateEmail(email: string): boolean { }
function transformUserData(user: User): UserDTO { }

// Глаголы для типичных операций:
// get, fetch, load  — получение данных
// set, update, save — изменение/сохранение
// create, build     — создание
// delete, remove    — удаление
// validate, check   — проверка
// format, parse     — преобразование
// handle, process   — обработка
```

---

## Булевы переменные: вопросы, на которые легко ответить

```typescript
// ❌ Неясно — это число? строка? флаг?
const active = true
const valid = false
const loading = true

// ✅ Формат вопроса — однозначно булево
const isActive = true
const isValid = false
const isLoading = true
const hasPermission = false
const canEdit = true
const shouldRefetch = false
```

---

## Длина имени пропорциональна области видимости

```typescript
// ✅ В цикле: короткое имя приемлемо, scope очевиден
for (let i = 0; i < items.length; i++) {
  process(items[i])
}

// ✅ В узком callback: краткое имя понятно из контекста
const userIds = users.map(u => u.id)

// ❌ В модуле: короткое имя бессмысленно
let d: Date       // что это? Когда создан? Что означает?
let u: User       // который из пользователей?

// ✅ В модуле: полное имя объясняет себя
let lastLoginDate: Date
let authenticatedUser: User
```

---

## Конвенции именования в TypeScript/JavaScript

| Что | Стиль | Пример |
|-----|-------|--------|
| Переменные, функции | camelCase | `userEmail`, `fetchOrders` |
| Классы, типы, интерфейсы | PascalCase | `UserService`, `OrderStatus` |
| Константы, env vars | SCREAMING_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |
| Файлы компонентов React | PascalCase | `UserCard.tsx` |
| Прочие файлы | kebab-case | `user-service.ts` |
| CSS-классы | kebab-case | `.user-card`, `.nav-link` |
| Приватные поля (ES2022) | `#field` | `#balance` |

---

## Самодокументирующийся код

### Magic numbers — враг читаемости

```typescript
// ❌ Что означает 86400? Почему 3? Что такое 0.15?
if (Date.now() - created > 86400 * 1000 * 3) {
  applyDiscount(price * 0.15)
}

// ✅ Константы с говорящими именами
const SECONDS_PER_DAY = 86400
const NEW_USER_GRACE_PERIOD_DAYS = 3
const NEW_USER_DISCOUNT_RATE = 0.15

if (Date.now() - created > SECONDS_PER_DAY * 1000 * NEW_USER_GRACE_PERIOD_DAYS) {
  applyDiscount(price * NEW_USER_DISCOUNT_RATE)
}
```

### Сложные условия — выносить в переменные

```typescript
// ❌ Нужно держать в голове несколько вещей одновременно
if (user.role === 'admin' || (user.role === 'editor' && user.isVerified && !user.isBanned)) {
  showEditButton()
}

// ✅ Условия объясняют себя
const isAdmin = user.role === 'admin'
const isVerifiedEditor = user.role === 'editor' && user.isVerified
const isNotBanned = !user.isBanned
const canEdit = isAdmin || (isVerifiedEditor && isNotBanned)

if (canEdit) {
  showEditButton()
}
```

---

## Когда нужны комментарии

Комментируйте **почему**, а не **что**:

```typescript
// ❌ Комментарий повторяет код — бесполезен
// Увеличиваем счётчик на 1
counter++

// ✅ Комментарий объясняет неочевидное решение
// Используем setTimeout 0 чтобы перенести выполнение в следующий тик event loop.
// Это нужно потому что DOM-обновление ещё не произошло в текущем тике.
setTimeout(() => scrollToBottom(), 0)

// ✅ Объясняем почему НЕ делаем очевидное
// Здесь намеренно не используем cache.get() — данные о ценах
// слишком критичны для устаревания даже на секунду.
const price = await fetchFreshPrice(productId)
```

---

## Итог

- **10:1** — соотношение чтения к написанию кода
- **Переменные** — существительные, отражают содержимое, не тип
- **Функции** — глаголы, описывают действие
- **Булевы** — `is`, `has`, `can`, `should` — формат вопроса
- **Длина имени** пропорциональна scope: `i` в цикле OK, `i` в модуле — нет
- **camelCase** — переменные/функции, **PascalCase** — типы/классы, **SCREAMING_SNAKE** — константы
- **Magic numbers** — выносить в именованные константы
- **Комментарии** — про «почему», не про «что»
