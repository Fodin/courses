# Задание 1.3: Builder

## Цель

Реализовать паттерн Builder для пошагового конструирования SQL-подобных запросов с цепочкой вызовов (fluent API).

## Требования

1. Создайте интерфейс `Query` с полями:
   - `table: string`, `fields: string[]`, `conditions: string[]`
   - `order?: { field: string; direction: 'asc' | 'desc' }`
   - `limitCount?: number`
2. Создайте класс `QueryBuilder` с методами:
   - `.select(...fields: string[])` — выбор полей
   - `.from(table: string)` — указание таблицы
   - `.where(condition: string)` — добавление условия (можно несколько)
   - `.orderBy(field: string, direction: 'asc' | 'desc')` — сортировка
   - `.limit(count: number)` — ограничение количества
   - `.build(): Query` — сборка финального объекта
   - `.toSQL(): string` — генерация SQL-строки
3. Каждый метод (кроме `build`/`toSQL`) возвращает `this` для цепочки
4. `build()` выбрасывает ошибку если не указаны `table` или `fields`

## Чеклист

- [ ] Интерфейс `Query` определён
- [ ] `QueryBuilder` поддерживает fluent chaining (`.select().from().where()`)
- [ ] Метод `.where()` поддерживает множественные условия
- [ ] `build()` валидирует обязательные поля
- [ ] `toSQL()` генерирует корректную SQL-строку
- [ ] Демонстрация показывает простые и сложные запросы

## Как проверить себя

1. Нажмите кнопку запуска
2. Убедитесь, что цепочка `.select().from().where().orderBy().limit().build()` работает
3. Убедитесь, что `build()` без `.from()` бросает ошибку
4. Убедитесь, что `toSQL()` генерирует правильный SQL
