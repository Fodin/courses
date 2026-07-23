# Задание 3.4 — Бизнес-сущность не место в shared (простое)

## Цель

Перенести доменную сущность из `shared` в `entities`, где ей и место.

## Что дано

- `shared/user/model/types.ts` — тип `User` (id, name, email), ошибочно
  оставленный в `shared` (только чтение, для сверки).
- `entities/user/model/types.ts` и `entities/user/index.ts` — пустые заготовки
  с TODO.
- `widgets/profile-header/ui/ProfileHeader.tsx` — импортирует `User` из
  `@/shared/user/model/types`.

## Требования

1. Определите `interface User` в `entities/user/model/types.ts` (те же поля:
   `id`, `name`, `email`).
2. Реэкспортируйте `User` из `entities/user/index.ts`.
3. Переключите импорт в `ProfileHeader.tsx` на `@/entities/user`.
4. Нажмите «Проверить».

## Чеклист

- [ ] `User` определён в `entities/user/model/types.ts`
- [ ] `entities/user/index.ts` реэкспортирует `User`
- [ ] `ProfileHeader.tsx` импортирует `User` из `@/entities/user`
- [ ] Пройти квиз уровня ≥ 80%
