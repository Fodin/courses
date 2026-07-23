# Задание 2.1 — Импорт вверх по слоям (простое)

## Цель

Убрать единственный импорт «вверх» — из `entities` в `features`.

## Что дано

- `entities/user/model/permissions.ts` импортирует `isPremiumUser` из
  `@/features/subscription`, чтобы решить, может ли пользователь редактировать
  профиль.

## Требования

1. Уберите импорт `@/features/subscription` из `permissions.ts`.
2. Добавьте `canEditProfile` второй параметр `isPremium: boolean` и используйте
   его вместо вызова `isPremiumUser`.
3. Нажмите «Проверить».

## Чеклист

- [ ] В `permissions.ts` нет импорта из `features`
- [ ] `canEditProfile(user: User, isPremium: boolean)` — сигнатура именно такая
- [ ] Пройти квиз уровня ≥ 80%
