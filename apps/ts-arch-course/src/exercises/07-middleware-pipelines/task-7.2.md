# Задание 7.2: Context Accumulation

## 🎯 Цель

Реализовать паттерн аккумуляции контекста, где каждый middleware расширяет тип контекста новыми свойствами, а TypeScript гарантирует правильный порядок выполнения.

## Требования

1. Создайте тип `AccumulatingMiddleware<TIn, TOut extends TIn>` — функцию, расширяющую тип контекста
2. Определите цепочку интерфейсов: `BaseContext` -> `WithUser` -> `WithPermissions` -> `WithAudit`
3. Реализуйте middleware для каждого шага расширения:
   - `addUser`: добавляет `user` с полями `id`, `name`, `role`
   - `addPermissions`: добавляет `permissions` на основе `user.role`
   - `addAudit`: добавляет `audit` с полями `action`, `userId`, `time`
4. Реализуйте функцию `pipe()` с перегрузками для типобезопасной композиции (минимум 3 перегрузки)

## Чеклист

- [ ] `AccumulatingMiddleware<TIn, TOut>` ограничивает `TOut extends TIn`
- [ ] Каждый middleware возвращает расширенный тип через spread
- [ ] `addPermissions(baseCtx)` вызывает ошибку компиляции (нет `user`)
- [ ] `addAudit(withUserCtx)` вызывает ошибку компиляции (нет `permissions`)
- [ ] `pipe(base, addUser, addPermissions)` возвращает `WithPermissions`
- [ ] Перегрузки `pipe()` проверяют совместимость middleware

## Как проверить себя

Попробуйте нарушить порядок middleware в `pipe()` — TypeScript должен показать ошибку. Убедитесь, что результат `pipe()` имеет все накопленные свойства с правильными типами.
