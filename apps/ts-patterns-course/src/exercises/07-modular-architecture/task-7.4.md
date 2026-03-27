# Задание 7.4: Module Contracts

## Цель

Реализовать типобезопасный публичный API модуля: контракт определяет что экспортируется, внутренности скрыты.

## Требования

1. Определите интерфейс `UserModuleContract`:
   - `createUser(input: CreateUserInput): User`
   - `getUser(id: string): User | null`
   - `listUsers(): User[]`
   - `deleteUser(id: string): boolean`
2. Определите интерфейс `NotificationModuleContract`:
   - `send(userId: string, message: string): void`
   - `getHistory(userId: string): Notification[]`
3. Создайте фабричные функции `createUserModule()` и `createNotificationModule(deps)`, возвращающие контракты
4. `NotificationModule` зависит от `UserModuleContract` (проверяет существование пользователя)
5. Продемонстрируйте взаимодействие модулей через контракты

## Чеклист

- [ ] Контракт `UserModuleContract` типизирован
- [ ] Контракт `NotificationModuleContract` типизирован
- [ ] Фабричные функции возвращают контракт, не реализацию
- [ ] NotificationModule зависит от UserModuleContract, не от деталей
- [ ] CRUD-операции работают через контракты
- [ ] Демонстрация межмодульного взаимодействия

## Как проверить себя

- Нажмите кнопку — должно отобразиться создание пользователей и отправка уведомлений
- Уведомление не отправляется несуществующему пользователю
- Модули взаимодействуют только через контракты
