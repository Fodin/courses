# Задание 7.1: Raw pg

## 🎯 Цель

Освоить работу с PostgreSQL через драйвер `pg`: настройка Pool, параметризованные запросы, CRUD-операции и обработка ошибок.

## Требования

1. Настройте `Pool` с параметрами: host, port, database, user, password, max, idleTimeoutMillis, connectionTimeoutMillis
2. Покажите опасность SQL injection и решение через параметризованные запросы (`$1`, `$2`, ...)
3. Реализуйте CRUD: SELECT (с фильтрацией), INSERT RETURNING, UPDATE RETURNING, DELETE
4. Покажите структуру результата: `{ rows, rowCount, command }`
5. Обработайте ошибки pg: unique_violation (23505), foreign_key_violation (23503), undefined_table (42P01)

## Чеклист

- [ ] Pool настроен с max connections и таймаутами
- [ ] SQL injection показан как анти-паттерн, параметризация как решение
- [ ] CRUD операции используют `pool.query(sql, params)`
- [ ] INSERT/UPDATE используют RETURNING для получения созданной/обновлённой записи
- [ ] Ошибки pg обрабатываются по err.code с маппингом на HTTP-статусы

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: Pool настроен, все CRUD-операции показаны с SQL и результатами, ошибки pg замаплены на HTTP-статусы.
