# Задание 7.1: Async + runInAction

## 🎯 Цель

Научиться корректно обновлять observable-состояние после асинхронных операций с помощью `runInAction`.

## 📋 Требования

Создайте стор `UserStoreAsync`, который загружает список пользователей с сервера:

1. Объявите observable-поля: `users: User[]`, `isLoading: boolean`, `error: string | null`
2. Используйте `makeAutoObservable` в конструкторе
3. Реализуйте `async fetchUsers()` метод:
   - Перед `await` установите `isLoading = true` и `error = null`
   - Вызовите `mockApi.fetchUsers()` через `await`
   - После `await` оберните обновления в `runInAction`:
     - Запишите полученных пользователей в `this.users`
     - Установите `isLoading = false`
   - В `catch` оберните обновления в `runInAction`:
     - Запишите ошибку в `this.error`
     - Установите `isLoading = false`
4. Создайте observer-компонент с кнопкой «Fetch Users» и списком пользователей

```typescript
interface User {
  id: string
  name: string
  email: string
}
```

## Чеклист

- [ ] Стор `UserStoreAsync` создан с `makeAutoObservable`
- [ ] `fetchUsers` — async-метод
- [ ] Обновления после `await` обёрнуты в `runInAction`
- [ ] Обработка ошибок в `catch` тоже обёрнута в `runInAction`
- [ ] Кнопка заблокирована во время загрузки
- [ ] Ошибка отображается в UI

## 🔍 Как проверить себя

1. Нажмите «Fetch Users» — должна появиться индикация загрузки
2. Через ~1 секунду появится список из 3 пользователей
3. Кнопка заблокирована во время загрузки
4. В консоли нет ошибок MobX об изменениях вне action
