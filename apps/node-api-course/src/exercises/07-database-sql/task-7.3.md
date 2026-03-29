# Задание 7.3: Prisma

## 🎯 Цель

Освоить Prisma ORM: определение схемы, генерация клиента и типизированные CRUD-операции с relations.

## Требования

1. Определите Prisma schema: model User, Post с relations (@relation), enum Role
2. Покажите типизированный CRUD: create, findUnique, findMany, update, upsert, delete
3. Реализуйте запрос с relations: `include` для загрузки связанных данных
4. Покажите пагинацию: `skip`, `take`, `orderBy`
5. Покажите `select` для выбора конкретных полей

## Чеклист

- [ ] Schema: model User с @id, @unique, @default, @relation, @updatedAt
- [ ] Schema: model Post с foreign key через @relation(fields, references)
- [ ] CRUD полностью типизирован: TypeScript знает типы всех полей
- [ ] Include: загрузка связанных постов с фильтрацией и сортировкой
- [ ] Select: выбор конкретных полей для оптимизации запроса

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: Prisma schema определена, CRUD-операции типизированы, include загружает relations, результат содержит вложенные данные.
