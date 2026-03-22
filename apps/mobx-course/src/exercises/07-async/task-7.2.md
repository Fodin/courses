# Задание 7.2: flow-генераторы

## 🎯 Цель

Освоить `flow` — альтернативу `async/await`, которая автоматически оборачивает код между `yield` в action-контекст.

## 📋 Требования

Создайте стор `UserStoreFlow`, аналогичный задаче 7.1, но с использованием `flow`:

1. Объявите observable-поля: `users: User[]`, `isLoading: boolean`, `error: string | null`
2. Используйте `makeAutoObservable` в конструкторе
3. Реализуйте `fetchUsers` через `flow(function* (...) { ... })`:
   - Используйте `yield` вместо `await`
   - **Не** используйте `runInAction` — flow делает это автоматически
   - Типизируйте `this` явно: `function* (this: UserStoreFlow)`
   - Обработайте ошибки в `try/catch`
4. Создайте observer-компонент с кнопкой и списком

```typescript
import { flow } from 'mobx'

// Паттерн использования flow:
fetchUsers = flow(function* (this: UserStoreFlow) {
  // yield вместо await
  // runInAction не нужен
})
```

## Чеклист

- [ ] Стор `UserStoreFlow` создан с `makeAutoObservable`
- [ ] `fetchUsers` объявлен через `flow(function* (...) { ... })`
- [ ] Используется `yield` вместо `await`
- [ ] `runInAction` **не** используется
- [ ] `this` типизирован в генераторе
- [ ] Обработка ошибок в `try/catch`

## 🔍 Как проверить себя

1. Нажмите «Fetch Users (flow)» — поведение идентично заданию 7.1
2. В консоли нет ошибок MobX
3. В коде нет ни одного `runInAction` — flow управляет контекстом сам
