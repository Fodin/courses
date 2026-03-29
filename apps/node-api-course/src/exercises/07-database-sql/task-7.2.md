# Задание 7.2: Knex

## 🎯 Цель

Освоить query builder Knex: построение запросов, миграции схемы и seeds для начальных данных.

## Требования

1. Настройте Knex: client, connection, pool options
2. Покажите query builder: `knex('table').select().where().orderBy().limit()`
3. Покажите сложные запросы: JOIN, WHERE с операторами (>=, IN), whereNotNull
4. Реализуйте миграцию: `createTable` с колонками (increments, string, enum, boolean, timestamps)
5. Реализуйте seed: `knex('table').del()` + `knex('table').insert([...])`

## Чеклист

- [ ] Knex настроен с pg client и pool
- [ ] Query builder: SELECT, INSERT (returning), JOIN показаны с SQL-эквивалентами
- [ ] WHERE: простой, с операторами (>=), whereIn, whereNotNull
- [ ] Миграция: createTable с primary key, unique, notNullable, defaultTo, timestamps
- [ ] Seed: очистка + вставка начальных данных

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: каждый Knex-запрос показан с SQL-эквивалентом, миграция создаёт таблицу users со всеми колонками, seed заполняет начальные данные.
