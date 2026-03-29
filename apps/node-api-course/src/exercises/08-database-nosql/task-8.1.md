# Задание 8.1: MongoDB Native Driver

## 🎯 Цель

Освоить работу с MongoDB через нативный драйвер: подключение MongoClient, CRUD-операции, создание индексов и aggregation pipeline.

## Требования

1. Настройте `MongoClient` с параметрами: maxPoolSize, minPoolSize, maxIdleTimeMS, retryWrites, write concern
2. Реализуйте CRUD: `insertOne`/`insertMany`, `findOne`/`find` с фильтрами (`$gte`, `$in`), `updateOne` с операторами (`$set`, `$push`, `$inc`), `deleteOne`
3. Создайте индексы: уникальный, составной, текстовый, TTL
4. Покажите `explain()` для анализа плана запроса (IXSCAN vs COLLSCAN)
5. Постройте aggregation pipeline: `$match`, `$group`, `$sort`, `$lookup`

## Чеклист

- [ ] MongoClient настроен с connection pool и retry
- [ ] CRUD операции используют операторы MongoDB ($set, $push, $gte и т.д.)
- [ ] Созданы 4 типа индексов (unique, compound, text, TTL)
- [ ] explain() показывает использование индекса
- [ ] Aggregation pipeline содержит минимум 3 стадии

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: MongoClient подключен с настройками пула, все CRUD-операции демонстрируются с результатами, индексы созданы и используются, aggregation pipeline возвращает агрегированные данные.
