# Задание 10.3: Dependency Inversion

## 🎯 Цель

Применить принцип инверсии зависимостей: бизнес-логика зависит от абстракций (портов), а конкретные реализации (адаптеры) инжектируются извне.

## Требования

1. Создайте интерфейсы-порты:
   - `Logger` — `info`, `error`, `warn`
   - `Cache<T>` — `get`, `set`, `delete`, `clear`
   - `NotificationService` — `sendEmail`, `sendPush`
   - `UserStore` — `findById`, `save`
2. Создайте `UserServiceDeps` — объект со всеми зависимостями
3. Реализуйте `createUserService(deps)`:
   - `getUser` — проверяет кеш, затем store, кеширует результат
   - `updateUser` — обновляет, инвалидирует кеш, отправляет уведомление
4. Создайте адаптеры: `createConsoleLogger`, `createMemoryCache`, `createMockNotifications`, `createMemoryUserStore`
5. Адаптеры должны быть подменяемыми без изменения бизнес-логики

## Чеклист

- [ ] `UserService` зависит от интерфейсов, не от конкретных классов
- [ ] `Logger`, `Cache`, `NotificationService`, `UserStore` — чистые интерфейсы
- [ ] `createUserService` принимает deps: UserServiceDeps
- [ ] `getUser` использует cache.get -> store.findById -> cache.set
- [ ] `updateUser` вызывает cache.delete (инвалидация) и notifications.sendEmail
- [ ] Адаптеры реализуют соответствующие интерфейсы полностью

## Как проверить себя

Создайте UserService с in-memory адаптерами. Вызовите `getUser` дважды — первый раз должен попасть в store, второй в кеш (проверьте через logger). Замените один адаптер — сервис должен продолжить работать.
