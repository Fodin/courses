# Уровень 9: Связанность, сцепленность и границы

## Coupling — связанность между модулями

Coupling — это степень зависимости одного модуля от другого. Аналогия: вагоны поезда. Жёсткая сцепка — один вагон сломался, весь состав стоит. Мягкая сцепка — вагон отцепили, остальные едут.

Виды coupling от лучшего к худшему:

| Тип | Что передаётся | Пример |
|-----|----------------|--------|
| Message | Только сигнал/вызов | Событие onClick |
| Data | Простые данные | Передаём `userId: string` |
| Stamp | Структура, используется часть | Передаём весь `User`, используем только `email` |
| Control | Флаги, управляющие поведением | `processUser(user, true)` |
| Common | Общие глобальные данные | Глобальный store |
| Content | Лезем во внутренности модуля | `module._private` |

```typescript
// ❌ Content coupling — худшее из зол
import userModule from './userModule'
userModule._internalCache.clear()  // залезаем во внутренности

// ❌ Control coupling — флаги управляют поведением
function formatDate(date: Date, isShort: boolean) {
  return isShort ? date.toLocaleDateString() : date.toLocaleDateString('ru', { weekday: 'long' })
}

// ✅ Data coupling — передаём только нужное
async function sendEmail(to: string, subject: string, body: string) { /* ... */ }
```

---

## Cohesion — сцепленность внутри модуля

Cohesion — насколько элементы одного модуля «про одно». Высокая сцепленность — все части работают для одной цели. Низкая — случайные попутчики.

```typescript
// ❌ Coincidental cohesion — случайная, «helpers.ts»
export function formatDate(d: Date) { /* ... */ }
export function generateUUID() { /* ... */ }
export function validateEmail(s: string) { /* ... */ }
export function sendEmail(to: string, body: string) { /* ... */ }
export function calculateTax(price: number) { /* ... */ }

// ✅ Functional cohesion — все части для одной задачи
// emailService.ts — всё про email
export function validateEmailAddress(email: string): boolean { /* ... */ }
export function formatEmailTemplate(template: string, vars: Record<string, string>): string { /* ... */ }
export async function sendEmail(to: string, subject: string, body: string): Promise<void> { /* ... */ }
```

---

## Закон Деметры

«Разговаривай только с ближайшими друзьями.» Модуль должен обращаться только к:
- собственным методам
- параметрам своих методов
- объектам, которые он создал
- прямым зависимостям

```typescript
// ❌ Нарушение: цепочка вызовов — слишком много «друзей»
const city = user.getAddress().getCity().getName()

// ❌ Знаем о структуре объекта глубоко внутри
const zipCode = order.customer.address.zipCode

// ✅ Tell, don't ask: пусть объект сам делает нужное
const city = user.getCity()        // User инкапсулирует навигацию по Address
const zipCode = order.getZipCode() // Order знает, как достать zipCode
```

---

## Архитектурные границы

Границы изолируют части системы. Изменение за границей не должно ломать то, что снаружи.

```typescript
// Interface segregation: маленькие специализированные интерфейсы
interface Readable { read(): string }
interface Writable { write(data: string): void }
// Клиент зависит только от того, что использует

// Anti-corruption layer: слой перевода между моделями
class ExternalCrmAdapter {
  toDomain(crmContact: CrmContact): Customer {
    return {
      id: crmContact.ContactId,          // маппинг полей
      email: crmContact.PrimaryEmail,    // другие имена
      name: `${crmContact.FirstName} ${crmContact.LastName}`,
    }
  }
}
```

---

## ⚠️ Частые ошибки

**Stamp coupling через объект целиком:**

```typescript
// ❌ Передаём весь User, используем только email
function sendNotification(user: User) {
  mailer.send(user.email)
}

// ✅ Data coupling — только нужное
function sendNotification(email: string) {
  mailer.send(email)
}
```

**Temporal cohesion (всё в init):**

```typescript
// ❌ Temporal cohesion — функции объединены только тем, что вызываются при старте
function initApp() {
  connectDatabase()
  loadTranslations()
  setupCacheService()
  initAnalytics()
  warmupSearchIndex()
}

// ✅ Разбиваем на группы по смыслу
async function initApp() {
  await initInfrastructure()   // БД, кэш — инфраструктура
  await initData()             // данные, индексы
  await initServices()         // сервисы верхнего уровня
}
```

---

## Итог

- **Низкий coupling** — модули независимы, можно менять один без другого
- **Высокий cohesion** — модуль «про одно», понятен и предсказуем
- **Закон Деметры** — не ходи по чужим внутренностям через цепочки
- **Архитектурные границы** — Anti-corruption Layer, Bounded Context, Ports & Adapters изолируют изменения
