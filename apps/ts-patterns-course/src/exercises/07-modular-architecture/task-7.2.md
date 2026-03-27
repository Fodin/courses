# Задание 7.2: Ports & Adapters

## Цель

Реализовать гексагональную архитектуру: бизнес-логика работает через порты (интерфейсы), не зная о конкретных адаптерах.

## Требования

1. Определите порт `UserRepository` с методами:
   - `findById(id: string): User | null`
   - `save(user: User): void`
   - `findAll(): User[]`
2. Создайте адаптер `InMemoryUserRepository` реализующий `UserRepository`
3. Создайте `UserService`, который принимает `UserRepository` через конструктор
4. В `UserService` реализуйте:
   - `getUser(id: string)` — находит пользователя или бросает ошибку
   - `createUser(name: string, email: string)` — создаёт и сохраняет
   - `listUsers()` — возвращает всех пользователей
5. Продемонстрируйте, что `UserService` работает с `InMemoryUserRepository` без изменений

## Чеклист

- [ ] Интерфейс `UserRepository` (порт) определён
- [ ] `InMemoryUserRepository` реализует порт
- [ ] `UserService` зависит только от интерфейса, не от реализации
- [ ] Создание, поиск и листинг пользователей работают
- [ ] Демонстрация: бизнес-логика не знает о хранилище

## Как проверить себя

- Нажмите кнопку — должен отобразиться список операций
- Пользователи создаются и находятся через InMemoryUserRepository
- UserService не содержит import/упоминаний InMemoryUserRepository
