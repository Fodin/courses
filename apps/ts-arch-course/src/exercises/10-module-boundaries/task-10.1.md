# Задание 10.1: Public API Surface

## 🎯 Цель

Спроектировать модуль с разделением на внутренние и публичные типы, где публичный API скрывает детали реализации через barrel export и маппинг типов.

## Требования

1. Создайте внутренний тип `InternalUserRecord` с приватными полями (`_id`, `_rev`, `passwordHash`, `deletedAt`)
2. Создайте публичный тип `PublicUser` с минимумом полей (`id`, `name`, `email`, `createdAt`)
3. Создайте типы для входных данных: `CreateUserInput`, `UpdateUserInput`, `UserQueryOptions`
4. Реализуйте функцию `toPublicUser(record: Internal) => Public` для маппинга на границе
5. Реализуйте `createUserModule()`, возвращающий объект с CRUD-методами:
   - `createUser`, `getUser`, `updateUser`, `listUsers`, `deleteUser`
   - Все методы возвращают `PublicUser`, не `InternalUserRecord`
6. `listUsers` поддерживает сортировку и пагинацию через `UserQueryOptions`

## Чеклист

- [ ] `InternalUserRecord` содержит приватные поля, не видимые снаружи
- [ ] `PublicUser` не содержит `passwordHash`, `_rev`, `deletedAt`
- [ ] Все методы модуля возвращают `PublicUser`, а не внутренний тип
- [ ] `toPublicUser` маппит `_id` -> `id`, `firstName + lastName` -> `name`
- [ ] `listUsers` поддерживает `sortBy`, `sortOrder`, `limit`, `offset`
- [ ] Soft delete: `deleteUser` помечает `deletedAt`, `listUsers` фильтрует удалённых

## Как проверить себя

Создайте несколько пользователей через модуль и проверьте, что возвращаемые объекты не содержат внутренних полей. Попробуйте обратиться к `user.passwordHash` — TypeScript должен показать ошибку.
