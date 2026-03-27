# Задание 8.3: TypeScript и InferType

## Цель

Научиться выводить TypeScript-типы из Yup-схем с помощью `InferType` и создавать типобезопасные функции валидации.

## Требования

1. Создайте `profileSchema` — объектную схему:
   - `firstName`: required, min(2)
   - `lastName`: required, min(2)
   - `email`: email, required
   - `age`: required, positive, integer, min(13), max(120)
   - `role`: `oneOf(['admin', 'editor', 'viewer'] as const)`, required
   - `bio`: optional, max(500)
   - `website`: url, nullable
   - `joinedAt`: date, `default(() => new Date())`

2. Выведите тип через `InferType`:
   ```ts
   type Profile = InferType<typeof profileSchema>
   ```

3. Создайте generic-функцию `validateProfile`:
   ```ts
   async function validateProfile(data: unknown):
     Promise<{ success: true; data: Profile } | { success: false; errors: string[] }>
   ```

4. Покажите `role` как литеральный тип (благодаря `as const`)

## Чеклист

- [ ] `role` использует `oneOf([...] as const)` для литеральных типов
- [ ] `InferType<typeof profileSchema>` создаёт корректный тип
- [ ] `bio` — optional (string | undefined)
- [ ] `website` — nullable (string | null)
- [ ] `joinedAt` — default (всегда присутствует)
- [ ] `validateProfile` корректно типизирована

## Как проверить себя

1. Заполните все обязательные поля — успех, показывается тип Profile
2. Пустая форма — показываются все ошибки
3. Age < 13 — ошибка "min 13"
4. Email невалидный — ошибка "Invalid email"
5. role отображается как литерал ("admin" | "editor" | "viewer")
6. website пустой — null (nullable), не ошибка
