# Задание 5.1: Repository (Типобезопасный CRUD)

## Цель

Реализовать паттерн Repository с типобезопасным CRUD-интерфейсом и InMemoryRepository для хранения сущностей в памяти.

## Требования

1. Создайте интерфейс `Repository<T extends { id: string }>` с методами:
   - `findById(id: string): T | undefined`
   - `findAll(): T[]`
   - `create(entity: T): T`
   - `update(id: string, updates: Partial<T>): T | undefined`
   - `delete(id: string): boolean`
2. Реализуйте класс `InMemoryRepository<T>`, который хранит данные в `Map<string, T>`
3. Метод `create` должен сохранять **копию** объекта (не ссылку)
4. Метод `update` должен мержить `updates` в существующую сущность, возвращая `undefined` если сущность не найдена
5. Продемонстрируйте работу с интерфейсом `User` (id, name, email, role)

## Чеклист

- [ ] Интерфейс `Repository<T>` определён с constraint `{ id: string }`
- [ ] `InMemoryRepository<T>` реализует все 5 методов
- [ ] `create` сохраняет копию объекта, а не ссылку
- [ ] `update` корректно мержит частичные обновления
- [ ] `update` возвращает `undefined` для несуществующего id
- [ ] `delete` возвращает `true`/`false` в зависимости от результата
- [ ] Демонстрация CRUD-операций выводит результаты в лог

## Как проверить себя

1. Нажмите кнопку запуска
2. Убедитесь, что create, findById, findAll, update и delete работают корректно
3. Проверьте, что update несуществующей сущности возвращает undefined
4. Убедитесь, что после delete сущность не найдена через findById
